import React from 'react';

// Course Module Schema Component
interface ModuleSchemaProps {
  moduleId: number;
  title: string;
  description: string;
  timeRequired: string;
}

export const ModuleSchema: React.FC<ModuleSchemaProps> = ({ moduleId, title, description, timeRequired }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": title,
    "description": description,
    "educationalLevel": "beginner to advanced",
    "learningResourceType": "module",
    "timeRequired": timeRequired,
    "isPartOf": {
      "@type": "Course",
      "name": "Napoleon Hill's Think and Grow Rich Complete Course",
      "provider": {
        "@type": "Organization",
        "name": "KongMindset",
        "url": "https://kongmindset.com"
      }
    },
    "teaches": [
      "Success Principles",
      "Wealth Mindset",
      "Personal Development",
      "Goal Achievement"
    ],
    "url": `https://kongmindset.com/modules/${moduleId}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Breadcrumb Schema Component
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Video Schema Component (for future video content)
interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl?: string;
}

export const VideoSchema: React.FC<VideoSchemaProps> = ({ 
  name, 
  description, 
  thumbnailUrl, 
  uploadDate, 
  duration, 
  embedUrl 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    ...(embedUrl && { "embedUrl": embedUrl }),
    "publisher": {
      "@type": "Organization",
      "name": "KongMindset",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kongmindset.com/favicon.svg"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Article Schema for Blog Posts
interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "KongMindset",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kongmindset.com/favicon.svg"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// How-To Schema for Implementation Guides
interface HowToSchemaProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
  }>;
  totalTime?: string;
}

export const HowToSchema: React.FC<HowToSchemaProps> = ({ name, description, steps, totalTime }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }),
    "supply": [
      "Computer or smartphone",
      "Internet connection",
      "Notebook for reflections"
    ],
    "tool": [
      "KongMindset course platform",
      "Napoleon Hill AI mentor"
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};