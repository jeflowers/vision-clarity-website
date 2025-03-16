// Advanced Locale-Specific Formatting Utility

class LocaleFormatter {
    /**
     * Format date according to locale-specific conventions
     * @param {Date} date - Date to format
     * @param {string} locale - Locale code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted date string
     */
    static formatDate(date, locale = 'en-US', options = {}) {
        const defaultOptions = {
            dateStyle: 'long',
            timeStyle: 'short'
        };

        try {
            return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
        } catch (error) {
            console.warn(`Date formatting error for locale ${locale}:`, error);
            return date.toLocaleString('en-US');
        }
    }

    /**
     * Format currency with locale-specific conventions
     * @param {number} amount - Monetary amount
     * @param {string} locale - Locale code
     * @param {string} currency - Currency code
     * @returns {string} Formatted currency string
     */
    static formatCurrency(amount, locale = 'en-US', currency = 'USD') {
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                currencyDisplay: 'symbol'
            }).format(amount);
        } catch (error) {
            console.warn(`Currency formatting error for locale ${locale}:`, error);
            return `$${amount.toFixed(2)}`;
        }
    }

    /**
     * Format number with locale-specific conventions
     * @param {number} number - Number to format
     * @param {string} locale - Locale code
     * @param {Object} options - Formatting options
     * @returns {string} Formatted number string
     */
    static formatNumber(number, locale = 'en-US', options = {}) {
        const defaultOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

        try {
            return new Intl.NumberFormat(locale, { ...defaultOptions, ...options }).format(number);
        } catch (error) {
            console.warn(`Number formatting error for locale ${locale}:`, error);
            return number.toString();
        }
    }

    /**
     * Get locale-specific first day of week
     * @param {string} locale - Locale code
     * @returns {number} First day of week (0-6, where 0 is Sunday)
     */
    static getFirstDayOfWeek(locale) {
        const weekdayOrder = {
            'en-US': 0,  // Sunday
            'ar-SA': 6,  // Saturday
            'he-IL': 6,  // Saturday
            default: 1   // Monday (most countries)
        };

        return weekdayOrder[locale] || weekdayOrder.default;
    }

    /**
     * Determine if a locale uses 12 or 24-hour time format
     * @param {string} locale - Locale code
     * @returns {boolean} True for 12-hour, false for 24-hour
     */
    static uses12HourFormat(locale) {
        const twelveHourLocales = ['en-US', 'en-GB', 'ar-SA'];
        return twelveHourLocales.includes(locale);
    }
}

// Export for use in other modules
export default LocaleFormatter;