import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  moduleSchema?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  moduleSchema,
  breadcrumbs
}) => {
  React.useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (ogTitle) updateMetaTag('og:title', ogTitle);
    if (ogDescription) updateMetaTag('og:description', ogDescription);
    if (ogImage) updateMetaTag('og:image', ogImage);

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    // Add structured data
    if (moduleSchema) {
      const existingScript = document.getElementById('module-schema');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.id = 'module-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(moduleSchema);
      document.head.appendChild(script);
    }

    // Add breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 1) {
      const existingBreadcrumb = document.getElementById('breadcrumb-schema');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }
      
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };
      
      const script = document.createElement('script');
      script.id = 'breadcrumb-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, moduleSchema, breadcrumbs]);

  return null;
};

export default SEOHead;