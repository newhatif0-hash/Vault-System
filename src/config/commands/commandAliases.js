/**
 * تكوين اختصارات الأوامر
 * يربط أسماء الأوامر المختصرة بأسماء الأوامر الكاملة
 */

export const commandAliases = {
    // الرصيد والمال
    'رصيد': 'balance',
    'فلوس': 'balance',
    'مصاري': 'balance',

    // المعاملات المالية
    'ودع': 'deposit',
    'شيل': 'withdraw',
    'شتغل': 'work',
    'يومي': 'daily',
    'قمار': 'gamble',
    'رهن': 'gamble',
    'سرقة': 'rob',
    'جريمة': 'crime',
    'حول': 'pay',
    'عطي': 'pay',
    'بعت': 'pay',

    // معلومات عامة
    'بينج': 'ping',
    'مساعدة': 'help',
    'ح': 'help',
    'معلومات': 'help',

    // أوامر التعديل
    'كسرة': 'ban',
    'بنعالي': 'ban',
    'برا': 'kick',
    'اطرد': 'kick',
    'اسكت': 'timeout',
    'سكوت': 'timeout',
    'تحذير': 'warn',
    'نبه': 'warn',
    'مسح': 'purge',
    'م': 'purge',
    'نضف': 'purge',
    'تكلم': 'untimeout',
    'فك_الصمت': 'untimeout',
    'شيل_الصمت': 'untimeout',

    // النظام والترتيب
    'مستوى': 'rank',
    'درجة': 'rank',
    'خبرة': 'rank',
    'لائحة': 'leaderboard',
    'ترتيب': 'leaderboard',
    'أفضل': 'leaderboard',
    'أول': 'leaderboard',

    // المتجر والمخزون
    'محل': 'shop',
    'شري': 'buy',
    'خزنة': 'inventory',
    'حاجياتي': 'inventory',
    'أشيائي': 'inventory',

    // معلومات المستخدم
    'بروفايل': 'userinfo',
    'صورة': 'avatar',
    'صورتي': 'avatar',
    'أيقونة': 'avatar',

    // أعياد الميلاد
    'ميلادي': 'birthday',
    'عيد': 'birthday',
    'ي': 'birthday',

    // ألعاب
    'رمية': 'flip',
    'عملة': 'flip',
    'رمي': 'roll',
};

export function resolveCommandAlias(commandName) {
    return commandAliases[commandName] || commandName;
    }
