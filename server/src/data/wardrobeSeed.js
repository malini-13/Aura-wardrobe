// AURA WARDROBE SETUP
// These are the user's real Cloudinary outfits. Add more records here as the collection grows.
// After saving this file, run: npm run seed:wardrobe (from the server folder)

export const wardrobeSeed = [
  {
    seedKey: 'purple-dress',
    name: 'Purple dress',
    category: 'dress',
    color: 'purple',
    tags: ['dress', 'party', 'evening', 'date'],
    imageUrl: 'https://res.cloudinary.com/dr0dq1oxi/image/upload/v1788554118/Purple_Dress_ejtc6c.png',
  },
  {
    seedKey: 'white-top-blue-jeans',
    name: 'White top and blue jeans',
    category: 'outfit',
    color: 'white and blue',
    tags: ['top', 'jeans', 'casual', 'college', 'day'],
    imageUrl: 'https://res.cloudinary.com/dr0dq1oxi/image/upload/v1788554119/White_top_and_blue_jeans_ag9fwb.png',
  },
  {
    seedKey: 'black-kurti-set',
    name: 'Black kurti set',
    category: 'ethnic wear',
    color: 'black',
    tags: ['kurti', 'ethnic', 'formal', 'college', 'day'],
    imageUrl: 'https://res.cloudinary.com/dr0dq1oxi/image/upload/v1788554117/Black_kurti_set_alxnwm.png',
  },
  {
    seedKey: 'black-shirt-vest-pant',
    name: 'Black shirt, vest and pant set',
    category: 'outfit',
    color: 'black',
    tags: ['shirt', 'vest', 'pants', 'formal', 'presentation', 'party', 'evening'],
    imageUrl: 'https://res.cloudinary.com/dr0dq1oxi/image/upload/v1788554116/Black_shirt_vest_pant_k40l7j.png',
  },
];
