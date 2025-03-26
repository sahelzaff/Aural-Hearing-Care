import assets from '../../public/assets/assets';

// Transform Google reviews to our component format
const reviews = [
  {
    id: 1,
    name: "Sahel Zaffarulla",
    stars: 5,
    text: "I recently visited Aural Hearing Care, and I am extremely impressed with the level of service I received. Dr. Rahul Pandey was exceptional in his support and care throughout my visit. His expertise and attention to detail made me feel confident and well taken care of. The entire team was professional and welcoming, making my experience a pleasant one.",
    image: assets.Test_2,
    accentImage: assets.quote_blue,
    duration: "Patient since August 2024"
  },
  {
    id: 2,
    name: "Dhananjay P",
    stars: 5,
    text: "Rahul provided an excellent service for hearing aid for my mother and most importantly after care service is also very good.",
    image: assets.Test_1,
    accentImage: assets.quote_green,
    duration: "Patient since July 2023"
  },
  {
    id: 3,
    name: "NILAY SAMRIT",
    stars: 5,
    text: "The whole team working in the hearing aid center is amazing. Friendly, cost-effective, and really want to help. This team is amazing with seniors and has the patience and understanding to give the best service. I would 100% recommend it to All. Great job being customer-focused.",
    image: assets.Test_3,
    accentImage: assets.quote_blue,
    duration: "Patient since July 2023"
  },
  {
    id: 4,
    name: "Siraj Khan",
    stars: 5,
    text: "A very professional and humble person dr.rahul pandey. He made me realize that it is normal to have hearing issue, also we had a detailed conversation regarding each and every doubt and dilemma I had. Honest person who is not behind looting patients rather he gives us the choice of options after explaining the details of each and every hearing device.",
    image: assets.Test_2,
    accentImage: assets.quote_green,
    duration: "Patient since August 2022"
  },
  {
    id: 5,
    name: "Kishore Mahashabde",
    stars: 5,
    text: "Rahul Pandey is one of the best audiologists of Nagpur. He is down to earth, always smiling and offers the best advice and solutions to all hearing related issues. His clinic has very good ambience and one becomes spirited on entering the premises. The support staff is friendly and cooperative.",
    image: assets.Test_1,
    accentImage: assets.quote_blue,
    duration: "Patient since August 2022"
  },
  {
    id: 6,
    name: "Piyali Kanabar",
    stars: 5,
    text: "My experience with Dr Rahul Pandey is very nice. Humble, trustworthy and dedicated in his profession Rahul is very proficient at his job.",
    image: assets.Test_3,
    accentImage: assets.quote_green,
    duration: "Patient since July 2022"
  },
  {
    id: 7,
    name: "Sanjay Karosiya",
    stars: 5,
    text: "This is the best place to buy hearing aids. Dr rahul pandey sir is a very good person. Nice clinic for all the people having any hearing problem! 👌👍",
    image: assets.Test_2,
    accentImage: assets.quote_blue,
    duration: "Patient since February 2022"
  },
  {
    id: 8,
    name: "Shubham Ubale",
    stars: 5,
    text: "Life is all about acceptance. Shri. Rahul sir, the most humble person will guide you in polite way to get out with proper solution for your problem & also he will develop confidence in you to accept the situation and go ahead.",
    image: assets.Test_1,
    accentImage: assets.quote_green,
    duration: "Patient since January 2022"
  },
  {
    id: 9,
    name: "Veerendra Mathur",
    stars: 5,
    text: "The overall experience was very satisfactory. We were handled with patience and care. We were also given the satisfaction of a free trial before purchase of a suitable product. Further, we have been assured of post sale service at the centre or remotely.",
    image: assets.Test_3,
    accentImage: assets.quote_blue,
    duration: "Patient since September 2021"
  },
  {
    id: 10,
    name: "Nilesh Sirmour",
    stars: 5,
    text: "Aural Hearing care is the best place in the nagpur to buy hearing aids at the reasonable price and the Rahul Pandey is best advisor and helpful person. And i highly recommend to you.. this the best!",
    image: assets.Test_2, 
    accentImage: assets.quote_green,
    duration: "Patient since July 2019"
  }
];

export default reviews; 