# Aural Hearing Care Loader Components

This package provides two professional loading components for different scenarios in your application:

1. **FullPageLoader**: A comprehensive loading screen for initial page loads
2. **MinimalLoader**: A compact loading indicator for page transitions and lighter operations

## Installation

No additional installation is required. These components are built with:
- React
- Framer Motion
- Next.js Image component
- TailwindCSS

## Usage

### FullPageLoader

Use this loader when the entire page is loading, such as during the initial application load or when navigating to a new page that requires significant data fetching.

```jsx
import { FullPageLoader } from '@/Components/Loaders';

// In your component:
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Your data fetching logic here
  const fetchData = async () => {
    try {
      // Fetch your data
      await someDataFetchingFunction();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  
  fetchData();
}, []);

return (
  <>
    <FullPageLoader isLoading={isLoading} />
    
    {/* Your page content here */}
    <YourPageContent />
  </>
);
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | boolean | `true` | Controls whether the loader is displayed |

### MinimalLoader

Use this loader for smaller operations like form submissions, button actions, or partial page updates.

```jsx
import { MinimalLoader } from '@/Components/Loaders';

// In your component:
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // Your form submission logic
    await submitForm(formData);
    setIsSubmitting(false);
  } catch (error) {
    console.error(error);
    setIsSubmitting(false);
  }
};

return (
  <div className="relative">
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
    
    <MinimalLoader 
      isLoading={isSubmitting} 
      size="md" 
      fixed={false} 
    />
  </div>
);
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | boolean | `false` | Controls whether the loader is displayed |
| `size` | string | `'md'` | Size of the loader: `'sm'`, `'md'`, or `'lg'` |
| `fixed` | boolean | `false` | If `true`, loader covers the entire viewport with a semi-transparent background |

## Example

An example component is included that demonstrates both loaders with controls:

```jsx
import { LoaderExample } from '@/Components/Loaders';

// In your page:
return <LoaderExample />;
```

## Implementation in _app.js or Layout

For a global initial loading experience, you can implement the `FullPageLoader` in your main layout or app wrapper:

```jsx
// In your _app.js or layout component:
import { useState, useEffect } from 'react';
import { FullPageLoader } from '@/Components/Loaders';

export default function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FullPageLoader isLoading={loading} />
      {!loading && <Component {...pageProps} />}
    </>
  );
}
```

## Using with Next.js Router Events

For page transitions, you can tie the `MinimalLoader` to Next.js router events:

```jsx
// In your _app.js or layout component:
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MinimalLoader } from '@/Components/Loaders';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <MinimalLoader isLoading={loading} fixed={true} size="md" />
      <Component {...pageProps} />
    </>
  );
}
```

## Customization

Both loaders use Aural Hearing Care's branding colors from your TailwindCSS configuration (auralblue and auralyellow). If you need to modify the appearance, you can edit the component files directly. 