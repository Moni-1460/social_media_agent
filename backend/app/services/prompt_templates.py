"""
Builds fully engineered prompts per tool type using:
- Role Prompting (assigning Gemini an expert persona)
- Context Prompting (topic, platform, tone, audience)
- Structured Output Prompting (explicit output format instructions)
- Template Prompting (per-tool reusable templates)
"""
from app.models.schemas import GenerateRequest


def _safe(value: str | None, fallback: str) -> str:
    return value if value and value.strip() else fallback


def _role_preamble(role: str) -> str:
    return (
        f"You are an expert {role} with 10+ years of experience crafting "
        "high-performing social media content. Follow the instructions precisely "
        "and respond ONLY with the requested content, no preamble or explanations.\n\n"
    )


def _instagram_prompt(topic: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("Instagram content strategist and copywriter")
        + f'Write an Instagram post about: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}\n\n"
        + "Requirements:\n"
        + "- Strong attention-grabbing first line\n"
        + "- 3-5 short paragraphs or line breaks, easy to skim\n"
        + "- End with a clear call-to-action\n"
        + "- Include 8-12 relevant hashtags at the end\n"
        + "- Include 2-3 relevant emojis naturally in the text"
    )


def _facebook_prompt(topic: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("Facebook marketing copywriter")
        + f'Write a Facebook post about: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}\n\n"
        + "Requirements:\n"
        + "- Conversational and community-oriented style\n"
        + "- 80-150 words\n"
        + "- End with a question or CTA that encourages comments"
    )


def _linkedin_prompt(topic: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("LinkedIn thought-leadership ghostwriter")
        + f'Write a professional LinkedIn post about: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}\n\n"
        + "Requirements:\n"
        + "- Hook in the first line\n"
        + "- Use short paragraphs (1-2 lines each) with line breaks for readability\n"
        + "- Include a personal insight or lesson learned\n"
        + "- End with a professional call-to-action or discussion question\n"
        + "- Add 3-5 relevant hashtags at the end"
    )


def _twitter_prompt(topic: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("Twitter/X growth copywriter")
        + f'Write a Twitter/X thread (5-7 tweets) about: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}\n\n"
        + "Requirements:\n"
        + "- Number each tweet (1/, 2/, 3/...)\n"
        + "- First tweet must hook the reader\n"
        + "- Each tweet under 280 characters\n"
        + "- Final tweet includes a call-to-action"
    )


def _caption_prompt(topic: str, platform: str, tone: str) -> str:
    return (
        _role_preamble("social media caption writer")
        + f'Write 3 different caption options for a {platform} post about: "{topic}"\n'
        + f"Tone: {tone}\n\n"
        + "Requirements:\n"
        + "- Number each option (1, 2, 3)\n"
        + "- Keep each caption under 150 characters\n"
        + "- Make each option distinct in style"
    )


def _hashtag_prompt(topic: str, platform: str) -> str:
    return (
        _role_preamble("hashtag research specialist")
        + f'Generate hashtags for a {platform} post about: "{topic}"\n\n'
        + "Requirements:\n"
        + "- Provide 20-25 hashtags\n"
        + "- Group them into: High-reach (broad), Medium-reach (niche), Low-reach (specific/branded)\n"
        + "- Format as a clean list under each heading"
    )


def _blog_prompt(topic: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("SEO content writer and blogger")
        + f'Write a blog post about: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}\n\n"
        + "Requirements:\n"
        + "- Include an engaging title\n"
        + "- Use an introduction, 3-4 subheadings with content, and a conclusion\n"
        + "- 500-700 words total\n"
        + "- Naturally incorporate the topic keywords for SEO"
    )


def _seo_prompt(topic: str) -> str:
    return (
        _role_preamble("SEO strategist")
        + f'Generate SEO assets for content about: "{topic}"\n\n'
        + "Provide, clearly labeled:\n"
        + "1. Primary keyword\n"
        + "2. 10 secondary/long-tail keywords\n"
        + "3. An SEO-optimized meta title (under 60 characters)\n"
        + "4. An SEO-optimized meta description (under 155 characters)"
    )


def _generic_prompt(topic: str, platform: str, tone: str, audience: str) -> str:
    return (
        _role_preamble("social media content creator")
        + f"Create social media content for the platform: {platform}\n"
        + f'Topic: "{topic}"\n'
        + f"Tone: {tone}\n"
        + f"Target audience: {audience}"
    )


def build_prompt(req: GenerateRequest) -> str:
    platform = _safe(req.platform, "General")
    tone = _safe(req.tone, "Engaging")
    audience = _safe(req.targetAudience, "General audience")
    topic = req.topic
    tool_type = req.toolType.strip().upper()

    if tool_type == "INSTAGRAM":
        return _instagram_prompt(topic, tone, audience)
    if tool_type == "FACEBOOK":
        return _facebook_prompt(topic, tone, audience)
    if tool_type == "LINKEDIN":
        return _linkedin_prompt(topic, tone, audience)
    if tool_type == "TWITTER":
        return _twitter_prompt(topic, tone, audience)
    if tool_type == "CAPTION":
        return _caption_prompt(topic, platform, tone)
    if tool_type == "HASHTAG":
        return _hashtag_prompt(topic, platform)
    if tool_type == "BLOG":
        return _blog_prompt(topic, tone, audience)
    if tool_type == "SEO":
        return _seo_prompt(topic)
    return _generic_prompt(topic, platform, tone, audience)
