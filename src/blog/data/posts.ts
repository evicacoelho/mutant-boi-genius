export interface Tag {
  id: string;
  name: string;
  type?: string;
}

export interface Post {
  id: string;
  title: string;
  date: Date;
  preview: string;
  tags: Tag[];
  content?: string; // For full post content
  author?: string;
}

export const ALL_POSTS: Post[] = [
  {
    id: '5',
    title: 'The Intersection of Street Art and Social Movements',
    date: new Date('2024-01-20'),
    preview: 'From the Berlin Wall to Black Lives Matter murals, street art has long served as a powerful voice for social change. This post examines how public art transforms urban landscapes into canvases for political expression and community dialogue, exploring notable movements and their lasting impact on societal discourse.',
    tags: [
      { id: 't13', name: 'Street Art', type: 'design' },
      { id: 't14', name: 'Social Movements', type: 'tattoo' },
      { id: 't15', name: 'Public Space', type: 'painting' }
    ]
  },
  {
    id: '6',
    title: 'Digital Anthropology: Understanding Internet Subcultures',
    date: new Date('2024-01-18'),
    preview: 'As our lives increasingly move online, new digital tribes and communities emerge. This exploration delves into the formation of internet subcultures - from niche hobby groups to viral meme communities - and what they reveal about human connection, identity formation, and social organization in the digital age.',
    tags: [
      { id: 't16', name: 'Digital Anthropology', type: 'photography' },
      { id: 't17', name: 'Internet Culture', type: 'audio' },
      { id: 't18', name: 'Subcultures', type: 'av' }
    ]
  },
  {
    id: '7',
    title: 'The Renaissance of Indigenous Art Forms',
    date: new Date('2024-01-14'),
    preview: 'Across continents, indigenous artists are reclaiming and revitalizing traditional art forms while addressing contemporary issues. This post highlights how native communities are blending ancestral techniques with modern mediums to preserve cultural heritage while engaging with global conversations about identity and sovereignty.',
    tags: [
      { id: 't19', name: 'Indigenous Art', type: 'essays' },
      { id: 't20', name: 'Cultural Heritage', type: 'resources' },
      { id: 't21', name: 'Traditional Arts', type: 'essays' }
    ]
  },
  {
    id: '8',
    title: 'The Sociology of Music Fandoms',
    date: new Date('2024-01-10'),
    preview: 'What drives the intense devotion of music fandoms? From Beatlemania to K-pop armies, this analysis explores the social dynamics, identity formation, and community structures within music fandoms. Discover how these communities create meaning, establish social hierarchies, and influence both artists and the music industry.',
    tags: [
      { id: 't22', name: 'Music Sociology', type: 'av' },
      { id: 't23', name: 'Fandom Studies', type: 'audio' },
      { id: 't24', name: 'Popular Culture', type: 'photography' }
    ]
  },
  {
    id: '9',
    title: 'Contemporary Dance as Social Commentary',
    date: new Date('2024-01-03'),
    preview: 'Modern choreographers are using movement to address pressing social issues from gender inequality to climate change. This piece examines how contemporary dance companies worldwide are creating visceral, embodied critiques of social structures, pushing audiences to engage with complex topics through non-verbal storytelling and physical expression.',
    tags: [
      { id: 't25', name: 'Contemporary Dance', type: 'painting' },
      { id: 't26', name: 'Performance Art', type: 'tattoo' },
      { id: 't27', name: 'Social Commentary', type: 'design' }
    ]
  },
  {
    id: '10',
    title: 'Urban Gentrification and the Loss of Cultural Spaces',
    date: new Date('2023-12-28'),
    preview: 'As cities transform through gentrification, artist studios, independent theaters, and community art centers often become casualties. This sociological investigation looks at the complex relationship between urban development, rising costs, and the erosion of creative ecosystems, while highlighting community-led initiatives fighting to preserve cultural authenticity.',
    tags: [
      { id: 't28', name: 'Urban Sociology', type: 'design' },
      { id: 't29', name: 'Gentrification', type: 'tattoo' },
      { id: 't30', name: 'Cultural Spaces', type: 'painting' }
    ]
  }
];

// Helper function to get posts by category
export const getPostsByCategory = (category: string): Post[] => {
  return ALL_POSTS.filter(post => 
    post.tags.some(tag => tag.type === category)
  );
};

// Get all unique categories from posts
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  ALL_POSTS.forEach(post => {
    post.tags.forEach(tag => {
      if (tag.type) {
        categories.add(tag.type);
      }
    });
  });
  return Array.from(categories);
};

// Get category display name
export const getCategoryDisplayName = (category: string): string => {
  const nameMap: Record<string, string> = {
    'essays': 'Essays',
    'design': 'Design',
    'tattoo': 'Tattoo',
    'painting': 'Painting',
    'photography': 'Photography',
    'audio': 'Audio',
    'av': 'Audio/Visual',
    'resources': 'Resources'
  };
  return nameMap[category] || category;
};