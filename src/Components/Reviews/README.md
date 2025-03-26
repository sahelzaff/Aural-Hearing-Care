# Reviews Component

A reusable, customizable component for displaying customer testimonials and reviews, with support for Google My Business reviews integration.

## Features

- Responsive slider that adapts to different screen sizes
- Support for Google My Business reviews via the Places API
- Fallback to default testimonials if Google reviews fail or are not configured
- Customizable styling, colors, and behavior
- Touch and mouse swipe support
- Autoplay with configurable speed
- Accessible navigation controls

## Usage

```jsx
import Reviews from '../../Components/Reviews/Reviews';

// Basic usage with default testimonials
<Reviews />

// With custom configuration
<Reviews 
  title="What Our Customers Say"
  titleColor="text-blue-800"
  accentColor="bg-yellow-500" 
  bgColor="bg-gray-100"
  maxReviews={6}
  slidesToShow={3}
  autoplay={true}
  autoplaySpeed={5000}
/>

// With Google My Business reviews
<Reviews 
  title="Our Google Reviews"
  useGoogleReviews={true}
  googlePlaceId="YOUR_GOOGLE_PLACE_ID"
  maxReviews={9}
/>
```

## Google My Business Integration

To use Google My Business reviews, you need to:

1. **Get a Google API Key**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Places API
   - Create an API key with appropriate restrictions

2. **Add your API key to environment variables**:
   - Create or update your `.env.local` file in the project root
   - Add: `GOOGLE_API_KEY=your_api_key_here`

3. **Find your Google Place ID**:
   - Use the [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
   - Search for your business
   - Copy the Place ID

4. **Configure the Reviews component**:
   ```jsx
   <Reviews 
     useGoogleReviews={true}
     googlePlaceId="YOUR_GOOGLE_PLACE_ID"
   />
   ```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "What Our Patients Say" | Section title |
| `titleColor` | string | "text-gray-800" | Title color class (TailwindCSS) |
| `accentColor` | string | "bg-auralblue" | Accent color for the underline (TailwindCSS) |
| `bgColor` | string | "bg-white" | Background color class (TailwindCSS) |
| `maxReviews` | number | 9 | Maximum number of reviews to display |
| `useGoogleReviews` | boolean | false | Whether to fetch reviews from Google |
| `googlePlaceId` | string | "" | Your Google Place ID |
| `customReviews` | array | null | Custom reviews data (overrides default and Google) |
| `slidesToShow` | number | 3 | Number of slides to show on desktop |
| `autoplay` | boolean | true | Whether to autoplay the slider |
| `autoplaySpeed` | number | 5000 | Autoplay speed in milliseconds |

## Customizing Reviews

To use your own custom reviews instead of the defaults or Google reviews:

```jsx
const myReviews = [
  {
    name: "Customer Name",
    date: "2 months ago",
    rating: 5,
    text: "Your review text here...",
    image: "/path/to/image.jpg",
    accentImage: "/path/to/accent.png", // Optional
    duration: "Customer for 2 years" // Optional
  },
  // Add more reviews...
];

<Reviews customReviews={myReviews} />
```

## Responsive Behavior

The component automatically adjusts the number of visible slides based on screen size:
- Mobile (< 640px): 1 slide
- Tablet (640px - 1024px): 2 slides
- Desktop (> 1024px): Value of the `slidesToShow` prop 