import { NextResponse } from 'next/server';

// Your Google API key should be stored in environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const maxReviews = searchParams.get('maxReviews') || 5;
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }
    
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Google API key not configured' },
        { status: 500 }
      );
    }
    
    // Fetch reviews from Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,formatted_phone_number,formatted_address&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: 'Failed to fetch reviews', details: data.status },
        { status: 500 }
      );
    }

    // Extract and format the reviews
    const reviews = data.result.reviews || [];
    const limitedReviews = reviews.slice(0, maxReviews);
    
    // Extract business details
    const businessInfo = {
      name: data.result.name,
      rating: data.result.rating,
      address: data.result.formatted_address,
      phone: data.result.formatted_phone_number,
      totalReviews: reviews.length
    };
    
    return NextResponse.json({
      business: businessInfo,
      reviews: limitedReviews
    });
    
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
} 