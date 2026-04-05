import { apiFetch } from '@/utils/api-client';

export interface PageContent {
  id?: number;
  pageId?: number;
  sectionType: 'EXPERIENCE' | 'HIGHLIGHTS' | 'PROCESS' | 'DESCRIPTION' | 'INTRODUCTION' | 'INCLUDES' | 'EXCLUDES' | 'NOT_SUITABLE' | 'OTHER';
  title: string;
  content: string;
  sortOrder: number;
}

export interface Menu {
  id?: number;
  pageId?: number;
  name: string;
  description: string;
  sortOrder: number;
}

export interface ImageAsset {
  id?: number;
  pageId?: number;
  url: string;
  sourceType: 'HERO' | 'CAROUSEL' | 'CONTENT' | 'MEDIA' | 'OTHER';
  altText?: string;
}

export interface Page {
  id: number;
  pageTypeId: number;
  pageTypeName: string;
  title: string;
  description: string;
  slug: string;
  contents: PageContent[];
  menus: Menu[];
  images: ImageAsset[];
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const MOCK_PAGES: Page[] = [
  {
    id: 1,
    pageTypeId: 1,
    pageTypeName: 'Cooking Class',
    title: 'The Art of Vietnamese Flavor',
    description: 'A culinary journey through the heart of Hoi An, discovering the balance of texture, aroma, and taste.',
    slug: '/',
    contents: [
      { id: 1, sectionType: 'INTRODUCTION', title: 'Our Story', content: 'Take a break from the busy streets of Hoi An and enjoy a peaceful 3-hour cooking class in a quiet countryside area, surrounded by rice fields and fresh air. This experience is hosted by Lily and her sister, who will guide you step by step in a warm, relaxed, and personal way.', sortOrder: 1 },
      { id: 101, sectionType: 'EXPERIENCE', title: 'Authentic Connection', content: 'After being picked up at the meeting point, you’ll travel to a calm rural location outside the city. Here, you can slow down, enjoy the green rice field views, and experience a simpler, more authentic side of local life.', sortOrder: 2 },
      { id: 102, sectionType: 'HIGHLIGHTS', title: 'Key Features', content: '• Around 3 hours, relaxed and not rushed\n• Located in a quiet countryside area, far from tourist crowds\n• Beautiful rice field views and a calm atmosphere\n• Small group with personal guidance by local hosts\n• Simple, everyday dishes that reflect local life in Hoi An', sortOrder: 3 }
    ],
    menus: [
      { id: 1, name: 'Banh Xeo', description: 'Vietnamese crispy pancake', sortOrder: 1 },
      { id: 2, name: 'Banana flower salad', description: 'Freshly prepared banana flower salad with aromatic Vietnamese herbs', sortOrder: 2 },
      { id: 3, name: 'Caramelized fish', description: 'Traditional Vietnamese stylized caramelized fish cooked in a clay pot', sortOrder: 3 },
      { id: 4, name: 'Cao Lau', description: 'Hoi An’s famous noodle dish', sortOrder: 4 }
    ],
    images: [
      { id: 1, sourceType: 'HERO', url: '/images/webp/cooking-class/hero.webp', altText: 'Authentic Hoi An cooking class with local family' },
      { id: 2, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/group.webp', altText: 'Cooking class participants preparing traditional dishes' },
      { id: 3, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/ingredients.webp', altText: 'Fresh local ingredients from Hoi An market' },
      { id: 4, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/shrimp-salad.webp', altText: 'Delicious traditional Vietnamese shrimp salad' },
      { id: 5, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/finished-dish.webp', altText: 'Beautifully presented finished Vietnamese dish' },
      { id: 23, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/hero.webp', altText: 'Professional cooking class workshop setting' },
      { id: 24, sourceType: 'CAROUSEL', url: '/images/webp/cooking-class/banana-flower-salad.webp', altText: 'Fresh banana flower salad ready for tasting' },
      { id: 6, sourceType: 'CONTENT', url: '/images/webp/cooking-class/caramelized-fish.webp', altText: 'Traditional stylized caramelized fish in clay pot' },
      { id: 7, sourceType: 'CONTENT', url: '/images/webp/cooking-class/banana-flower-salad.webp', altText: 'Fresh banana flower salad with local herbs' },
      { id: 25, sourceType: 'CONTENT', url: '/images/webp/cooking-class/shrimp-salad.webp', altText: 'Close-up of fresh shrimp salad ingredients' },
      { id: 26, sourceType: 'CONTENT', url: '/images/webp/cooking-class/ingredients.webp', altText: 'Locally sourced spices and herbs from the market' },
      { id: 27, sourceType: 'CONTENT', url: '/images/webp/cooking-class/group.webp', altText: 'Small group cooking experience in countryside house' }
    ]
  },
  {
    id: 2,
    pageTypeId: 2,
    pageTypeName: 'Food Tour',
    title: 'Authentic Hoi An Street Food Tour',
    description: 'Journey through hidden alleyways and savor the unique flavors that define our ancient town’s culinary heritage.',
    slug: '/food-tour',
    contents: [
      { id: 2, sectionType: 'INTRODUCTION', title: 'Journey Description', content: 'Journey through hidden alleyways and savor the unique flavors that define our ancient town’s culinary heritage.', sortOrder: 1 },
      { id: 201, sectionType: 'OTHER', title: 'Full Description', content: 'Hoi An is more than just an ancient town with its charming yellow heritage houses – it\'s a vibrant crossroads where Vietnamese, Chinese, and Japanese culinary traditions have merged over centuries, creating distinctive flavors found nowhere else in the world.', sortOrder: 2 }
    ],
    menus: [
      { id: 11, name: 'Bánh Mỳ', description: 'Vietnamese baguette with uniquely Hoi An-style filling', sortOrder: 1 },
      { id: 12, name: 'Cao Lầu', description: 'An exclusive noodle dish found only in Hoi An with our secret broth recipe', sortOrder: 2 },
      { id: 13, name: 'Bánh Xèo', description: 'Golden, crispy pancakes served with fresh aromatic herbs', sortOrder: 3 }
    ],
    images: [
      { id: 8, sourceType: 'HERO', url: '/images/webp/food-tour/food-tour-hoi-an-13.webp', altText: 'Hoi An food tour guide in ancient town' },
      { id: 9, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-6.webp', altText: 'Food tour group enjoying local specialties' },
      { id: 10, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-4.webp', altText: 'Grilled Nem spring rolls on charcoal' },
      { id: 11, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-8.webp', altText: 'Street food stall in Hoi An ancient town' },
      { id: 28, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-13.webp', altText: 'Hoi An ancient town food tour experience' },
      { id: 29, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-10.webp', altText: 'Traditional herbal tea in local Hoi An courtyard' },
      { id: 30, sourceType: 'CAROUSEL', url: '/images/webp/food-tour/food-tour-hoi-an-11.webp', altText: 'Exploring hidden food gems in Hoi An alleys' },
      { id: 12, sourceType: 'CONTENT', url: '/images/webp/food-tour/food-tour-hoi-an-1.webp', altText: 'Authentic Hoi An Banh My baguette' },
      { id: 31, sourceType: 'CONTENT', url: '/images/webp/food-tour/food-tour-hoi-an-2.webp', altText: 'Cao Lau noodles specialty of Hoi An' },
      { id: 32, sourceType: 'CONTENT', url: '/images/webp/food-tour/food-tour-hoi-an-3.webp', altText: 'Crispy Banh Xeo pancakes being prepared' },
      { id: 33, sourceType: 'CONTENT', url: '/images/webp/food-tour/food-tour-hoi-an-5.webp', altText: 'Local market scene during morning food tour' },
      { id: 34, sourceType: 'CONTENT', url: '/images/webp/food-tour/food-tour-hoi-an-7.webp', altText: 'Traditional Mango cake dessert' },
      { id: 59, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-1.webp', altText: 'Authentic Hoi An Banh My baguette' },
      { id: 60, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-2.webp', altText: 'Cao Lau noodles exclusive to Hoi An ancient town' },
      { id: 61, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-3.webp', altText: 'Crispy Banh Xeo pancakes with fresh herbs' },
      { id: 62, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-4.webp', altText: 'Grilled Nem spring rolls on charcoal' },
      { id: 63, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-5.webp', altText: 'Local market vibrant colors and fresh produce' },
      { id: 64, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-6.webp', altText: 'Food tour group enjoying local specialties' },
      { id: 65, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-7.webp', altText: 'Delicious Mango cake traditional dessert' },
      { id: 66, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-8.webp', altText: 'Street food stall in Hoi An ancient town at night' },
      { id: 67, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-10.webp', altText: 'Traditional herbal tea served in a local house' },
      { id: 68, sourceType: 'MEDIA', url: '/images/webp/food-tour/food-tour-hoi-an-11.webp', altText: 'Hidden alleyway in Hoi An filled with food gems' }
    ]
  },
  {
    id: 3,
    pageTypeId: 3,
    pageTypeName: 'Making Lantern',
    title: 'Making Lantern',
    description: 'Craft your own traditional silk lantern with local artisans.',
    slug: '/making-lantern',
    contents: [
      { id: 3, sectionType: 'INTRODUCTION', title: 'Lantern Art', content: 'Create your own beautiful Hoi An silk lantern in our traditional craft workshop. Learn from local artisans and take home a piece of Vietnamese heritage.', sortOrder: 1 },
      { id: 301, sectionType: 'EXPERIENCE', title: 'Immersive Crafting', content: 'In this engaging workshop, we invite you to immerse yourself in the art of lantern making. Under the guidance of skilled craftsmen, you will learn how to bend bamboo, apply vibrant silk, and complete your very own traditional lantern.', sortOrder: 2 }
    ],
    menus: [
      { id: 31, name: 'Lantern History', description: 'Learn about the significance of lanterns in Hoi An\'s heritage', sortOrder: 1 },
      { id: 32, name: 'Selecting Materials', description: 'Choose your favorite bamboo frame shape and beautiful Vietnamese silk colors', sortOrder: 2 }
    ],
    images: [
      { id: 35, sourceType: 'HERO', url: '/images/webp/lantern-making/lantern-class-hero.webp', altText: 'Traditional Hoi An lantern making workshop hero' },
      { id: 36, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/lantern-class-main.webp', altText: 'Main view of lantern making class' },
      { id: 37, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/stock-lantern-1.webp', altText: 'Vibrant silk lanterns variety' },
      { id: 38, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/stock-lantern-2.webp', altText: 'Handmade bamboo frames for lanterns' },
      { id: 39, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/stock-lantern-3.webp', altText: 'Artisan applying glue to lantern frame' },
      { id: 40, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/stock-lantern-4.webp', altText: 'Student stretching silk over lantern' },
      { id: 41, sourceType: 'CAROUSEL', url: '/images/webp/lantern-making/stock-lantern-5.webp', altText: 'Finished handmade lanterns glowing at night' },
      { id: 42, sourceType: 'CONTENT', url: '/images/webp/lantern-making/stock-lantern-8.webp', altText: 'Close-up of lantern craftsmanship' },
      { id: 43, sourceType: 'CONTENT', url: '/images/webp/lantern-making/stock-lantern-1.webp', altText: 'Workshop atmosphere with colorful lanterns' },
      { id: 44, sourceType: 'CONTENT', url: '/images/webp/lantern-making/stock-lantern-2.webp', altText: 'Preparation of bamboo frames' },
      { id: 45, sourceType: 'CONTENT', url: '/images/webp/lantern-making/stock-lantern-3.webp', altText: 'Detail of applying silk to frame' },
      { id: 46, sourceType: 'CONTENT', url: '/images/webp/lantern-making/stock-lantern-4.webp', altText: 'Finishing touches on a silk lantern' },
      { id: 69, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-1.webp', altText: 'Colorful variety of Hoi An silk lanterns' },
      { id: 70, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-2.webp', altText: 'Bamboo frames for traditional lantern making' },
      { id: 71, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-3.webp', altText: 'Artisan applying glue to lantern bamboo frame' },
      { id: 72, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-4.webp', altText: 'Stretching vibrant yellow silk over lantern frame' },
      { id: 73, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-5.webp', altText: 'Finished handmade lanterns glowing at night' },
      { id: 74, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-6.webp', altText: 'Workshop participants crafting their lanterns' },
      { id: 75, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-7.webp', altText: 'Tassels and decorative elements for lanterns' },
      { id: 76, sourceType: 'MEDIA', url: '/images/webp/lantern-making/stock-lantern-8.webp', altText: 'Intricate details of a completed Hoi An lantern' }
    ]
  },
  {
    id: 4,
    pageTypeId: 4,
    pageTypeName: 'Making Coffee',
    title: 'Making Coffee',
    description: 'Master the art of traditional Vietnamese coffee making in the heart of Hoi An.',
    slug: '/making-coffee-class',
    contents: [
      { id: 4, sectionType: 'INTRODUCTION', title: 'Coffee Workshop', content: 'Learn to make authentic Vietnamese egg coffee, coconut coffee, and salt coffee in our hands-on workshop in Hoi An. Discover the secrets of the Phin filter.', sortOrder: 1 },
      { id: 401, sectionType: 'OTHER', title: 'The Art of Coffee', content: 'Vietnam boasts one of the most unique coffee cultures in the world. From the robust beans grown in the Central Highlands to the creative ways we mix ingredients, coffee here is an art form.', sortOrder: 2 }
    ],
    menus: [
      { id: 41, name: 'Vietnamese Phin Coffee', description: 'Traditional dark roast robusta brewed with a stainless steel filter', sortOrder: 1 },
      { id: 42, name: 'Hanoi Egg Coffee (Cà Phê Trứng)', description: 'A creamy, dessert-like coffee topped with whipped egg yolks and condensed milk', sortOrder: 2 }
    ],
    images: [
      { id: 47, sourceType: 'HERO', url: '/images/webp/coffee-making/coffee-class-hero.webp', altText: 'Vietnamese coffee workshop hero image' },
      { id: 48, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/coffee-class-main.webp', altText: 'Traditional coffee brewing process' },
      { id: 49, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/stock-coffee-1.webp', altText: 'Freshly brewed Phin coffee' },
      { id: 50, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/stock-coffee-2.webp', altText: 'Whisking egg yolks for coffee' },
      { id: 51, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/stock-coffee-3.webp', altText: 'Coconut milk coffee preparation' },
      { id: 52, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/stock-coffee-4.webp', altText: 'Salt coffee specialty' },
      { id: 53, sourceType: 'CAROUSEL', url: '/images/webp/coffee-making/stock-coffee-5.webp', altText: 'Roasted coffee beans close-up' },
      { id: 54, sourceType: 'CONTENT', url: '/images/webp/coffee-making/stock-coffee-9.webp', altText: 'Step-by-step coffee making guide' },
      { id: 55, sourceType: 'CONTENT', url: '/images/webp/coffee-making/stock-coffee-1.webp', altText: 'Traditional coffee filter and cup' },
      { id: 56, sourceType: 'CONTENT', url: '/images/webp/coffee-making/stock-coffee-2.webp', altText: 'Creamy egg coffee topping' },
      { id: 57, sourceType: 'CONTENT', url: '/images/webp/coffee-making/stock-coffee-3.webp', altText: 'Refreshing iced coconut coffee' },
      { id: 58, sourceType: 'CONTENT', url: '/images/webp/coffee-making/stock-coffee-4.webp', altText: 'Central Vietnam salt coffee experience' },
      { id: 77, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-1.webp', altText: 'Authentic Vietnamese Phin filter brewing coffee' },
      { id: 78, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-2.webp', altText: 'Fluffy whipped egg yolks for traditional Hanoi egg coffee' },
      { id: 79, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-3.webp', altText: 'Freshly prepared coconut coffee with condensed milk' },
      { id: 80, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-4.webp', altText: 'Savory salt coffee specialty from Central Vietnam' },
      { id: 81, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-5.webp', altText: 'Coffee beans from the Central Highlands of Vietnam' },
      { id: 82, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-6.webp', altText: 'Coffee workshop participants learning brewing techniques' },
      { id: 83, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-7.webp', altText: 'Traditional coffee set in a Hoi An cafe' },
      { id: 84, sourceType: 'MEDIA', url: '/images/webp/coffee-making/stock-coffee-8.webp', altText: 'Close-up of coffee dripping through a stainless steel Phin' }
    ]
  }
];

const IS_MOCK = import.meta.env.VITE_IS_MOCK_DATA !== 'false'; 

export const pageService = {
  getAll: async (params?: { title?: string; slug?: string; pageTypeId?: number; page?: number; size?: number }): Promise<PaginatedResponse<Page>> => {
    if (IS_MOCK) {
       // Simulate filtering
       let filtered = [...MOCK_PAGES];
       if (params?.title) filtered = filtered.filter(p => p.title.toLowerCase().includes(params.title!.toLowerCase()));
       if (params?.slug) filtered = filtered.filter(p => p.slug.includes(params.slug!));

      return {
        data: filtered,
        metadata: {
          totalRecords: filtered.length,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1
        }
      };
    }
    const query = new URLSearchParams();
    if (params?.title) query.append('title', params.title);
    if (params?.slug) query.append('slug', params.slug);
    if (params?.pageTypeId) query.append('pageTypeId', params.pageTypeId.toString());
    if (params?.page) query.append('page', (params.page - 1).toString());
    if (params?.size) query.append('size', params.size.toString());

    return apiFetch<PaginatedResponse<Page>>(`/pages?${query.toString()}`);
  },

  getById: async (id: number): Promise<Page> => {
    if (IS_MOCK) {
      const page = MOCK_PAGES.find(p => p.id === id);
      if (!page) throw new Error('Mock page not found');
      return JSON.parse(JSON.stringify(page)); 
    }
    const response = await apiFetch<ApiResponse<Page>>(`/pages/${id}`);
    return response.data;
  },

  update: async (id: number, request: any): Promise<Page> => {
    if (IS_MOCK) {
      console.log('Mock Update:', id, request);
      // Simulate update by finding and replacing in local mock list if needed, 
      // but for UI demo we just return success
      return request;
    }
    const response = await apiFetch<ApiResponse<Page>>(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (IS_MOCK) return;
    await apiFetch(`/pages/${id}`, { method: 'DELETE' });
  }
};
