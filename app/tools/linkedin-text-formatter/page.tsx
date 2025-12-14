'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import ToolLayout from '@/app/components/ToolLayout';
import { getTool } from '@/lib/tools';

// Unicode character maps for formatting
const BOLD_MAP: Record<string, string> = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

const ITALIC_MAP: Record<string, string> = {
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
};

const BOLD_ITALIC_MAP: Record<string, string> = {
    'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
    'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
};

// Popular emojis for quick access
const POPULAR_EMOJIS = [
    '👍', '❤️', '🔥', '💡', '✨', '🎯', '🚀', '💪',
    '👏', '🙌', '💯', '⭐', '✅', '📈', '🎉', '💼',
    '🤝', '💬', '📢', '🌟', '🏆', '📌', '💎', '🔑',
    '😊', '🤔', '👀', '🙏', '📊', '🎓', '💻', '🌍'
];

// Bullet and list symbols
const BULLET_SYMBOLS = ['•', '◦', '▪', '▸', '→', '★', '✓', '✦'];
const NUMBER_SYMBOLS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

// LinkedIn "See More" cutoff (characters shown before truncation)
const LINKEDIN_MOBILE_CUTOFF = 140;
const LINKEDIN_DESKTOP_CUTOFF = 210;
const LINKEDIN_MAX_CHARS = 3000;

// Special symbols and decorative elements (unique feature!)
const SPECIAL_SYMBOLS = {
    dividers: ['━━━━━━━━━━', '▬▬▬▬▬▬▬▬▬▬', '═══════════', '┈┈┈┈┈┈┈┈┈┈', '╌╌╌╌╌╌╌╌╌╌', '◆◆◆◆◆◆◆', '◇◇◇◇◇◇◇', '⬥⬥⬥⬥⬥⬥⬥'],
    arrows: ['➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '➤', '►', '◀', '▶', '⇒', '⇐', '⇑', '⇓', '↔', '↕'],
    checkmarks: ['✓', '✔', '☑', '✅', '☐', '☒', '⬜', '⬛', '🔲', '🔳'],
    stars: ['★', '☆', '✪', '✫', '✯', '⭐', '🌟', '💫', '✨', '⚡'],
    pointers: ['👉', '👈', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '✌️', '🤞'],
    brackets: ['【', '】', '『', '』', '「', '」', '〔', '〕', '《', '》', '〈', '〉'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💖'],
};

// Post templates (unique feature!)
const POST_TEMPLATES = [
    {
        name: '🎯 Hook + Story',
        template: `[Attention-grabbing statement or question]

Here's what happened...

[Your story in 2-3 short paragraphs]

The lesson?

[Key takeaway]

—

What's your experience with [topic]?

#YourHashtag`
    },
    {
        name: '💡 Quick Tip',
        template: `Quick tip for [your audience]:

[Your tip in one sentence]

Here's why it works:

→ [Benefit 1]
→ [Benefit 2]
→ [Benefit 3]

Try it today. Thank me later.

♻️ Repost if this helps someone!

#YourHashtag`
    },
    {
        name: '📋 Listicle',
        template: `[Number] [things/tips/lessons] that [benefit]:

1️⃣ [Point one]

2️⃣ [Point two]

3️⃣ [Point three]

4️⃣ [Point four]

5️⃣ [Point five]

Which one resonates most with you?

#YourHashtag`
    },
    {
        name: '🔥 Hot Take',
        template: `Unpopular opinion:

[Your controversial take]

Here's why I believe this:

[Your reasoning]

[Supporting example]

Agree or disagree?

Drop a 🔥 if you're with me.

#YourHashtag`
    },
    {
        name: '📢 Announcement',
        template: `🚀 Big news!

[Your announcement]

Here's what this means:

✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

I'm incredibly grateful for [acknowledgment]

[Call to action]

#YourHashtag`
    },
    {
        name: '❓ Question Post',
        template: `I'm curious...

[Your question to the audience]

I'll go first:

[Your answer]

Now your turn 👇

#YourHashtag`
    },
];

// Hashtag categories (unique feature!)
const HASHTAG_CATEGORIES = {
    'Career': ['#CareerAdvice', '#JobSearch', '#Hiring', '#Resume', '#Interview', '#CareerGrowth', '#ProfessionalDevelopment'],
    'Tech': ['#Technology', '#AI', '#MachineLearning', '#WebDevelopment', '#Programming', '#Coding', '#Tech', '#Innovation'],
    'Business': ['#Entrepreneurship', '#Startup', '#Business', '#Leadership', '#Management', '#Strategy', '#Growth'],
    'Marketing': ['#Marketing', '#DigitalMarketing', '#ContentMarketing', '#SocialMedia', '#Branding', '#SEO', '#Copywriting'],
    'Productivity': ['#Productivity', '#TimeManagement', '#WorkLifeBalance', '#RemoteWork', '#WFH', '#Motivation', '#Success'],
    'Personal': ['#PersonalBranding', '#Networking', '#Inspiration', '#Mindset', '#Learning', '#Growth', '#Life'],
};

const STYLES = {
    boldSerif: {
        name: 'Bold (Serif)',
        map: {
            'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
            'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
            '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
        }
    },
    boldSans: {
        name: 'Bold (Sans)',
        map: {
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
            'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
            '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
        }
    },
    italicSerif: {
        name: 'Italic (Serif)',
        map: {
            'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
            'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧'
        }
    },
    italicSans: {
        name: 'Italic (Sans)',
        map: {
            'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
            'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
        }
    },
    script: {
        name: 'Script',
        map: {
            'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
            'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏'
        }
    },
    monospace: {
        name: 'Monospace',
        map: {
            'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
            'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
            '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
        }
    },
    bubble: {
        name: 'Bubble',
        map: {
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
            '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
        }
    }
};

export default function LinkedInTextFormatter() {
    const tool = getTool('linkedin-text-formatter');
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showBulletPicker, setShowBulletPicker] = useState(false);
    const [showNumberPicker, setShowNumberPicker] = useState(false);
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // New unique feature states
    const [showTemplates, setShowTemplates] = useState(false);
    const [showSymbols, setShowSymbols] = useState(false);
    const [showHashtags, setShowHashtags] = useState(false);
    const [activeSymbolCategory, setActiveSymbolCategory] = useState<keyof typeof SPECIAL_SYMBOLS>('dividers');
    const [activeHashtagCategory, setActiveHashtagCategory] = useState<keyof typeof HASHTAG_CATEGORIES>('Career');

    // Calculate post analytics
    const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
    const charCount = input.length;
    const readingTime = Math.ceil(wordCount / 200); // avg 200 wpm
    const isOverLimit = charCount > LINKEDIN_MAX_CHARS;
    const hookText = input.substring(0, LINKEDIN_MOBILE_CUTOFF);
    const hasGoodHook = hookText.includes('?') || hookText.includes('!') || /\d/.test(hookText);

    // Close all dropdowns
    const closeAllDropdowns = useCallback(() => {
        setShowEmojiPicker(false);
        setShowBulletPicker(false);
        setShowNumberPicker(false);
        setShowTemplates(false);
        setShowSymbols(false);
        setShowHashtags(false);
    }, []);

    // Save to undo stack before making changes
    const saveToUndo = useCallback(() => {
        setUndoStack(prev => [...prev.slice(-20), input]);
        setRedoStack([]);
    }, [input]);

    // Apply character map transformation to selected text
    const applyFormatToSelection = useCallback((charMap: Record<string, string>) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) {
            // No selection - show hint
            return;
        }

        saveToUndo();

        const selectedText = input.substring(start, end);
        const transformedText = selectedText.split('').map(char => charMap[char] || char).join('');
        const newText = input.substring(0, start) + transformedText + input.substring(end);

        setInput(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + transformedText.length);
        }, 0);
    }, [input, saveToUndo]);

    // Apply underline using combining character
    const applyUnderline = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) return;

        saveToUndo();

        const selectedText = input.substring(start, end);
        // Add combining underline character after each character (skip whitespace/newlines)
        const transformedText = Array.from(selectedText).map(char => {
            if (char === ' ' || char === '\n' || char === '\r' || char === '\t') return char;
            return char + '\u0332';
        }).join('');
        const newText = input.substring(0, start) + transformedText + input.substring(end);

        setInput(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + transformedText.length);
        }, 0);
    }, [input, saveToUndo]);

    // Apply strikethrough using combining character
    const applyStrikethrough = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) return;

        saveToUndo();

        const selectedText = input.substring(start, end);
        // Add combining strikethrough character after each character (skip whitespace/newlines)
        const transformedText = Array.from(selectedText).map(char => {
            if (char === ' ' || char === '\n' || char === '\r' || char === '\t') return char;
            return char + '\u0336';
        }).join('');
        const newText = input.substring(0, start) + transformedText + input.substring(end);

        setInput(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + transformedText.length);
        }, 0);
    }, [input, saveToUndo]);

    // Insert text at cursor position
    const insertAtCursor = useCallback((text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        saveToUndo();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = input.substring(0, start) + text + input.substring(end);

        setInput(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    }, [input, saveToUndo]);

    // Handle bullet list insertion
    const insertBulletList = useCallback((bullet: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        saveToUndo();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = input.substring(start, end);

        let newText: string;
        if (selectedText.includes('\n')) {
            // Multiple lines - add bullet to each
            const lines = selectedText.split('\n');
            const bulletedLines = lines.map(line => line.trim() ? `${bullet} ${line.trim()}` : '').join('\n');
            newText = input.substring(0, start) + bulletedLines + input.substring(end);
        } else if (selectedText) {
            // Single line selected
            newText = input.substring(0, start) + `${bullet} ${selectedText}` + input.substring(end);
        } else {
            // No selection - just insert bullet
            newText = input.substring(0, start) + `${bullet} ` + input.substring(end);
        }

        setInput(newText);
        setShowBulletPicker(false);

        setTimeout(() => {
            textarea.focus();
        }, 0);
    }, [input, saveToUndo]);

    // Handle numbered list insertion
    const insertNumberedList = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        saveToUndo();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = input.substring(start, end);

        let newText: string;
        if (selectedText.includes('\n')) {
            // Multiple lines - add numbers to each
            const lines = selectedText.split('\n');
            const numberedLines = lines.map((line, i) => {
                if (!line.trim()) return '';
                const num = NUMBER_SYMBOLS[i] || `${i + 1}.`;
                return `${num} ${line.trim()}`;
            }).join('\n');
            newText = input.substring(0, start) + numberedLines + input.substring(end);
        } else if (selectedText) {
            // Single line selected
            newText = input.substring(0, start) + `① ${selectedText}` + input.substring(end);
        } else {
            // No selection - just insert first number
            newText = input.substring(0, start) + `① ` + input.substring(end);
        }

        setInput(newText);
        setShowNumberPicker(false);

        setTimeout(() => {
            textarea.focus();
        }, 0);
    }, [input, saveToUndo]);

    // Undo
    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        setRedoStack(prev => [...prev, input]);
        const previousState = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        setInput(previousState);
    }, [input, undoStack]);

    // Redo
    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;

        setUndoStack(prev => [...prev, input]);
        const nextState = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        setInput(nextState);
    }, [input, redoStack]);

    // Clear all formatting (reset to plain text)
    const clearFormatting = useCallback(() => {
        saveToUndo();
        // This removes Unicode formatting by normalizing to ASCII where possible
        // For a complete clear, we'd need to reverse all mappings
        setInput(input);
    }, [input, saveToUndo]);

    const transformText = (text: string, styleKey: keyof typeof STYLES) => {
        const map = STYLES[styleKey].map;
        return text.split('').map(char => map[char as keyof typeof map] || char).join('');
    };

    const handleCopy = (text: string, styleKey: string) => {
        navigator.clipboard.writeText(text);
        setCopied(styleKey);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleCopyMain = () => {
        navigator.clipboard.writeText(input);
        setCopied('main');
        setTimeout(() => setCopied(null), 2000);
    };

    const displayText = input || 'Start writing and your post will appear here..';

    if (!tool) return null;

    return (
        <ToolLayout
            title={tool.title}
            description={tool.description}
            toolKey="linkedin-text-formatter"
        >
            {/* Input and Preview Section */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
                {/* Input with Toolbar */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col">
                    <label htmlFor="input" className="block text-sm font-semibold text-gray-700 mb-3">
                        Enter your text
                    </label>

                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0">
                        {/* Bold */}
                        <button
                            onClick={() => applyFormatToSelection(BOLD_MAP)}
                            className="p-2 hover:bg-gray-200 rounded font-bold text-gray-700 transition-colors"
                            title="Bold (select text first)"
                            aria-label="Bold"
                        >
                            B
                        </button>

                        {/* Italic */}
                        <button
                            onClick={() => applyFormatToSelection(ITALIC_MAP)}
                            className="p-2 hover:bg-gray-200 rounded italic text-gray-700 transition-colors"
                            title="Italic (select text first)"
                            aria-label="Italic"
                        >
                            I
                        </button>

                        {/* Underline */}
                        <button
                            onClick={applyUnderline}
                            className="p-2 hover:bg-gray-200 rounded underline text-gray-700 transition-colors"
                            title="Underline (select text first)"
                            aria-label="Underline"
                        >
                            U
                        </button>

                        {/* Strikethrough */}
                        <button
                            onClick={applyStrikethrough}
                            className="p-2 hover:bg-gray-200 rounded line-through text-gray-700 transition-colors"
                            title="Strikethrough (select text first)"
                            aria-label="Strikethrough"
                        >
                            S
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Emoji Picker */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker);
                                    setShowBulletPicker(false);
                                    setShowNumberPicker(false);
                                }}
                                className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Insert Emoji"
                                aria-label="Insert Emoji"
                            >
                                😊
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64">
                                    <div className="grid grid-cols-8 gap-1">
                                        {POPULAR_EMOJIS.map((emoji, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    insertAtCursor(emoji);
                                                    setShowEmojiPicker(false);
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded text-lg"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Undo */}
                        <button
                            onClick={handleUndo}
                            disabled={undoStack.length === 0}
                            className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Undo"
                            aria-label="Undo"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </button>

                        {/* Redo */}
                        <button
                            onClick={handleRedo}
                            disabled={redoStack.length === 0}
                            className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Redo"
                            aria-label="Redo"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Clear */}
                        <button
                            onClick={() => { saveToUndo(); setInput(''); }}
                            className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                            title="Clear All"
                            aria-label="Clear All"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Bullet List */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowBulletPicker(!showBulletPicker);
                                    setShowEmojiPicker(false);
                                    setShowNumberPicker(false);
                                }}
                                className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Bullet List"
                                aria-label="Bullet List"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                            {showBulletPicker && (
                                <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="flex gap-1">
                                        {BULLET_SYMBOLS.map((bullet, i) => (
                                            <button
                                                key={i}
                                                onClick={() => insertBulletList(bullet)}
                                                className="p-2 hover:bg-gray-100 rounded text-lg"
                                            >
                                                {bullet}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Numbered List */}
                        <button
                            onClick={insertNumberedList}
                            className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                            title="Numbered List"
                            aria-label="Numbered List"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" />
                            </svg>
                        </button>

                        {/* Line Spacing (UNIQUE!) - moved inline with lists */}
                        <button
                            onClick={() => {
                                saveToUndo();
                                // Add double line breaks for readability
                                const spaced = input.replace(/\n(?!\n)/g, '\n\n');
                                setInput(spaced);
                            }}
                            className="p-2 hover:bg-orange-100 rounded text-orange-600 transition-colors"
                            title="Add Line Spacing (readability)"
                            aria-label="Line Spacing"
                        >
                            ↕️
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Templates (UNIQUE!) */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowTemplates(!showTemplates);
                                    setShowSymbols(false);
                                    setShowHashtags(false);
                                    setShowEmojiPicker(false);
                                    setShowBulletPicker(false);
                                }}
                                className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                                title="Post Templates"
                                aria-label="Post Templates"
                            >
                                📝
                            </button>
                            {showTemplates && (
                                <div className="absolute top-full right-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-64 max-h-80 overflow-y-auto">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">POST TEMPLATES</div>
                                    {POST_TEMPLATES.map((template, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                saveToUndo();
                                                setInput(template.template);
                                                setShowTemplates(false);
                                            }}
                                            className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm mb-1"
                                        >
                                            {template.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Special Symbols (UNIQUE!) */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowSymbols(!showSymbols);
                                    setShowTemplates(false);
                                    setShowHashtags(false);
                                    setShowEmojiPicker(false);
                                    setShowBulletPicker(false);
                                }}
                                className="p-2 hover:bg-purple-100 rounded text-purple-600 transition-colors"
                                title="Special Symbols & Dividers"
                                aria-label="Special Symbols"
                            >
                                ✦
                            </button>
                            {showSymbols && (
                                <div className="absolute top-full right-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-72">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">SPECIAL SYMBOLS</div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {(Object.keys(SPECIAL_SYMBOLS) as Array<keyof typeof SPECIAL_SYMBOLS>).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveSymbolCategory(cat)}
                                                className={`px-2 py-1 text-xs rounded ${activeSymbolCategory === cat ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {SPECIAL_SYMBOLS[activeSymbolCategory].map((symbol, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    insertAtCursor(symbol);
                                                    setShowSymbols(false);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded text-lg min-w-[40px]"
                                                title={`Insert: ${symbol}`}
                                            >
                                                {symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hashtags (UNIQUE!) */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowHashtags(!showHashtags);
                                    setShowTemplates(false);
                                    setShowSymbols(false);
                                    setShowEmojiPicker(false);
                                    setShowBulletPicker(false);
                                }}
                                className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
                                title="Popular Hashtags"
                                aria-label="Hashtags"
                            >
                                #
                            </button>
                            {showHashtags && (
                                <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-80 max-h-80 overflow-y-auto -translate-x-1/2">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">POPULAR HASHTAGS</div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {(Object.keys(HASHTAG_CATEGORIES) as Array<keyof typeof HASHTAG_CATEGORIES>).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveHashtagCategory(cat)}
                                                className={`px-2 py-1 text-xs rounded ${activeHashtagCategory === cat ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {HASHTAG_CATEGORIES[activeHashtagCategory].map((tag, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    insertAtCursor(tag + ' ');
                                                    setShowHashtags(false);
                                                }}
                                                className="px-2 py-1 hover:bg-gray-100 rounded text-sm text-green-700 bg-green-50"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <textarea
                        ref={textareaRef}
                        id="input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type something amazing... Select text and use the toolbar above to format it!"
                        className="w-full flex-1 min-h-[280px] p-4 border-2 border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base border-t-0"
                        onClick={() => {
                            setShowEmojiPicker(false);
                            setShowBulletPicker(false);
                            setShowNumberPicker(false);
                            setShowTemplates(false);
                            setShowSymbols(false);
                            setShowHashtags(false);
                        }}
                    />

                    {/* Post Analytics (UNIQUE!) */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">📝</span>
                                <span className="font-medium">{wordCount}</span>
                                <span className="text-gray-500">words</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className={`font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-700'}`}>{charCount}</span>
                                <span className="text-gray-500">/ {LINKEDIN_MAX_CHARS}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">⏱️</span>
                                <span className="font-medium">{readingTime}</span>
                                <span className="text-gray-500">min read</span>
                            </div>
                            {charCount > LINKEDIN_MOBILE_CUTOFF && (
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${hasGoodHook ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    <span>{hasGoodHook ? '✅' : '⚠️'}</span>
                                    <span className="text-xs">{hasGoodHook ? 'Strong hook!' : 'Add a hook (?, !, or numbers)'}</span>
                                </div>
                            )}
                        </div>

                        {/* "See More" Preview Line (UNIQUE!) */}
                        {charCount > LINKEDIN_MOBILE_CUTOFF && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <span>📱</span> Mobile users see first {LINKEDIN_MOBILE_CUTOFF} chars before "...see more"
                                </div>
                                <div className="p-2 bg-white rounded border-l-4 border-blue-400 text-sm">
                                    <span className="text-gray-700">{hookText}</span>
                                    <span className="text-blue-500 font-medium">...see more</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                        <button
                            onClick={handleCopyMain}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${copied === 'main'
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {copied === 'main' ? '✓ Copied!' : 'Copy Text'}
                        </button>
                    </div>
                </div>

                {/* LinkedIn Preview */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-gray-700">
                            Post Preview
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
                                title="Mobile view"
                                aria-label="Switch to mobile view"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
                                title="Desktop view"
                                aria-label="Switch to desktop view"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className={`bg-[#f3f2ef] rounded-lg p-2 sm:p-4 flex-1 min-h-[280px] ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                            {/* Post Header */}
                            <div className="p-2 sm:p-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/logo.jpg"
                                            alt="FormatMint"
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-xs sm:text-sm text-gray-900">FormatMint</div>
                                        <div className="text-xs text-gray-700 truncate">Fast, clean and free online tools for developers</div>
                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                            <span>Just now</span>
                                            <span>•</span>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <button className="text-gray-600 hover:bg-gray-100 rounded p-1" aria-label="More options">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-2 sm:px-3 pb-2 sm:pb-3">
                                <div className={`text-sm whitespace-pre-wrap break-words leading-relaxed min-h-[80px] sm:min-h-[120px] ${input ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                                    {displayText}
                                </div>
                            </div>

                            {/* Reactions */}
                            <div className="px-2 sm:px-3 pb-1 sm:pb-2 flex items-center justify-between text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#0a66c2] flex items-center justify-center border border-white">
                                            <svg className="w-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                                            </svg>
                                        </div>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#df704d] flex items-center justify-center border border-white">
                                            <svg className="w-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs">57</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <span>24</span>
                                    <span className="hidden sm:inline">comments</span>
                                    <span>•</span>
                                    <span>6</span>
                                    <span className="hidden sm:inline">reposts</span>
                                </div>
                            </div>

                            {/* Post Actions */}
                            <div className="border-t border-gray-200 px-1 py-1 flex items-center justify-between">
                                <button className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded text-gray-600 text-xs sm:text-sm font-medium" aria-label="Like">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                    </svg>
                                    <span className="hidden sm:inline">Like</span>
                                </button>
                                <button className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded text-gray-600 text-xs sm:text-sm font-medium" aria-label="Comment">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                    <span className="hidden sm:inline">Comment</span>
                                </button>
                                <button className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded text-gray-600 text-xs sm:text-sm font-medium" aria-label="Repost">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                    </svg>
                                    <span className="hidden sm:inline">Repost</span>
                                </button>
                                <button className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded text-gray-600 text-xs sm:text-sm font-medium" aria-label="Send">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    <span className="hidden sm:inline">Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formatting Options */}
            <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Style</h2>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(STYLES).map(([key, style]) => {
                        const transformed = transformText(displayText, key as keyof typeof STYLES);
                        return (
                            <div key={key} className="bg-white p-4 sm:p-5 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-semibold text-gray-700">{style.name}</span>
                                    <button
                                        onClick={() => handleCopy(transformed, key)}
                                        className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${copied === key
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        aria-label={`Copy ${style.name} formatted text`}
                                    >
                                        {copied === key ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm sm:text-base text-gray-900 break-words min-h-[2.5rem] p-3 bg-gray-50 rounded border border-gray-200">
                                    {transformed}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Type your text in the input box</li>
                    <li>• See a live preview of how it will look on LinkedIn</li>
                    <li>• Choose a formatting style and click "Copy"</li>
                    <li>• Paste directly into your LinkedIn post</li>
                    <li>• All processing happens locally in your browser</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
