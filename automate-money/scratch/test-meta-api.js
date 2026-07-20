import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const token = 'EAAOq9OGZCu9EBRybFerkmi0ui8Ph1ipuEC9hZC3ZAgC4H5ztzmeAeLMD448VoAaHk1ZAMD9Qdum5RFtYTgmPdgwDgUFs7jLL3QdXksc6zpigZCCudLfNnbV8DLxcOQcA7j9Ys7BApkRczZB05WfIxm3skRknZAljcgDYdaJN3hUK0jAItDigI0aqB7UY2adFVvXnIALY0ZBJZBEfIQRrhLODJUMcZAk39aDQEchudJJKNpJWgF7AjkvPzEdAQozmaRUAjnRtxgOu5h6I7ZAd6QFQKKhkOzZCi5CS9XhbdAZDZD';

async function test() {
  const url = new URL('https://graph.facebook.com/v20.0/ads_archive');
  url.searchParams.append('access_token', token);
  url.searchParams.append('search_terms', 'gym');
  url.searchParams.append('ad_reached_countries', JSON.stringify(['IN']));
  url.searchParams.append('ad_type', 'ALL');
  url.searchParams.append('ad_active_status', 'ACTIVE');
  url.searchParams.append('limit', '5');
  url.searchParams.append('fields', 'id,ad_creation_time,ad_delivery_start_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_snapshot_url,page_id,page_name,publisher_platforms');

  console.log('Sending request to Meta Graph API...');
  const res = await fetch(url.toString());
  const data = await res.json();
  console.log('Response status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));
}

test().catch(console.error);
