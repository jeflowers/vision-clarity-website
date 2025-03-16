// Advanced Error Tracking and Monitoring Utility

class ErrorTracker {
    constructor(config = {}) {
        // Configuration with sensible defaults
        this.config = {
            enableConsoleLogging: true,
            remoteLoggingEndpoint: config.remoteLoggingEndpoint || null,
            sensitivityThreshold: config.sensitivityThreshold || 'warning'
        };

        // Error type classification
        this.errorTypes = {
            translation: 'TRANSLATION_ERROR',
            localization: 'LOCALIZATION_ERROR',
            formatting: 'FORMATTING_ERROR',
            network: 'NETWORK_ERROR'
        };
    }

    /**
     * Log error with comprehensive details
     * @param {string} type - Error type
     * @param {Object} details - Error details
     * @param {string} severity - Error severity
     */
    log(type, details, severity = 'warning') {
        const errorPayload = {
            timestamp: new Date().toISOString(),
            type,
            details,
            severity,
            context: this._getCurrentContext()
        };

        // Console logging
        if (this.config.enableConsoleLogging) {
            this._logToConsole(errorPayload);
        }

        // Remote logging
        if (this.config.remoteLoggingEndpoint) {
            this._logToRemoteService(errorPayload);
        }
    }

    /**
     * Capture translation-related errors
     * @param {string} key - Translation key
     * @param {string} language - Language code
     * @param {Object} details - Additional error details
     */
    captureTranslationError(key, language, details = {}) {
        this.log(this.errorTypes.translation, {
            key,
            language,
            ...details
        });
    }

    /**
     * Capture localization formatting errors
     * @param {string} locale - Locale code
     * @param {string} formatType - Type of formatting (date, currency, etc.)
     * @param {Object} details - Additional error details
     */
    captureLocalizationError(locale, formatType, details = {}) {
        this.log(this.errorTypes.localization, {
            locale,
            formatType,
            ...details
        });
    }

    /**
     * Get current application context
     * @returns {Object} Current context information
     * @private
     */
    _getCurrentContext() {
        return {
            language: document.documentElement.lang,
            url: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };
    }

    /**
     * Log to console with styled output
     * @param {Object} payload - Error payload
     * @private
     */
    _logToConsole(payload) {
        const consoleMethod = payload.severity === 'error' ? console.error : console.warn;
        consoleMethod(`[${payload.type}] Error Tracking:`, payload);
    }

    /**
     * Send error to remote logging service
     * @param {Object} payload - Error payload
     * @private
     */
    _logToRemoteService(payload) {
        if (!this.config.remoteLoggingEndpoint) return;

        try {
            fetch(this.config.remoteLoggingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).catch(networkError => {
                console.warn('Remote logging failed:', networkError);
            });
        } catch (error) {
            console.error('Error logging mechanism failed:', error);
        }
    }
}

// Create a singleton instance for global error tracking
const errorTracker = new ErrorTracker({
    enableConsoleLogging: true,
    remoteLoggingEndpoint: '/api/error-tracking'
});

// Export for use in other modules
export default errorTracker;