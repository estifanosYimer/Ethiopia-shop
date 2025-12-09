import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import { translateText } from '../services/geminiService';
import { Loader2 } from 'lucide-react';

interface AutoTranslatedTextProps {
  value: string;      // The English fallback text
  translationKey?: string; // The key to check in i18n.tsx
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
}

const AutoTranslatedText: React.FC<AutoTranslatedTextProps> = ({ 
  value, 
  translationKey, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { language, t } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string>(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. If language is English, just show the value
    if (language === 'en') {
      setTranslatedContent(value);
      return;
    }

    // 2. Try to get it from i18n (Static Dictionary)
    if (translationKey) {
      const staticTranslation = t(translationKey);
      // If t() returns something different than the key, it means a translation exists
      if (staticTranslation !== translationKey) {
        setTranslatedContent(staticTranslation);
        return;
      }
    }

    // 3. Check Local Storage Cache (to avoid repeated API calls)
    const cacheKey = `tr_${language}_${value.substring(0, 16)}_${value.length}`; // Simple hash
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslatedContent(cached);
      return;
    }

    // 4. AI Translation Needed
    let isMounted = true;
    setIsLoading(true);

    translateText(value, language)
      .then((result) => {
        if (isMounted) {
          setTranslatedContent(result);
          localStorage.setItem(cacheKey, result); // Save to cache
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedContent(value); // Fallback
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [language, value, translationKey, t]);

  if (isLoading) {
    return (
        <Component className={`${className} opacity-70 animate-pulse`}>
           {translatedContent} 
        </Component>
    );
  }

  return <Component className={className}>{translatedContent}</Component>;
};

export default AutoTranslatedText;