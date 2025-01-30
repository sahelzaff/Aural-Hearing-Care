const Dummy_Products = [
  {
    id: "1",
    name: "Advanced Digital Hearing Aid",
    brand: "Wibex",
    description: `
      The Advanced Digital Hearing Aid by Wibex is a state-of-the-art device designed to provide superior hearing support through a seamless blend of advanced technology and modern convenience. It features cutting-edge noise cancellation technology, ensuring crystal-clear sound even in noisy environments, allowing users to focus on important conversations and sounds. The adaptive sound processing intelligently adjusts to various listening situations, delivering optimal sound quality and comfort.

      This hearing aid is designed for the modern user, featuring Bluetooth connectivity for easy pairing with smartphones, tablets, and other devices. Users can stream phone calls, music, and audio directly to their hearing aids, making it a versatile tool for both personal and professional use. It supports multiple listening programs, customizable for specific environments such as crowded restaurants, outdoor spaces, or quiet rooms. These programs can be adjusted with a simple touch or through a dedicated smartphone app, offering both convenience and personalization.
    `,
    price: 89999,
    discounted_price: 79999,
    stock_status: "In Stock",
    features: [
      "Bluetooth Connectivity",
      "Noise Cancellation",
      "Rechargeable Battery",
      "Water Resistant",
      "Smartphone App Control"
    ],
    specifications: {
      type: "Behind-the-ear (BTE)",
      battery_life: "Up to 30 hours",
      warranty: "2 years",
      water_resistance: "IP68",
      bluetooth_version: "5.0",
      dimensions: "3.5 x 1.5 x 0.8 inches",
      weight: "0.5 ounces",
      color: "Silver",
      frequency_range: "100 Hz - 10 kHz",
      maximum_output: "120 dB SPL",
      microphone_type: "Directional",
      noise_reduction: "20 dB",
      operating_temperature: "-10°C to 45°C",
      storage_temperature: "-20°C to 60°C",
      charging_time: "3 hours",
      connectivity: "Bluetooth, NFC",
      compatible_devices: "iOS, Android, Windows"
    },
    images: [
      { url: "/assets/product_1.avif", alt_text: "Front view" },
      { url: "/assets/product_2.avif", alt_text: "Side view" },
      { url: "/assets/product_3.avif", alt_text: "Back view" },
      { url: "/assets/product_4.avif", alt_text: "In-ear view" },
    ],
    terms_and_conditions: `
      The Advanced Digital Hearing Aid comes with a 2-year warranty covering manufacturing defects. The warranty does not cover damage caused by misuse or unauthorized modifications. Customers are advised to read the user manual carefully before use.
    `,
    refund_and_return_policy: `
      Customers can return the product within 30 days of purchase for a full refund, provided the product is in its original condition and packaging. Return shipping costs are the responsibility of the customer. Refunds will be processed within 7-10 business days after the product is received and inspected.
    `,
    guarantee: `
      We guarantee the quality and performance of the Advanced Digital Hearing Aid. If you experience any issues, please contact our customer support for assistance.
    `
  },
  {
    id: "2",
    name: "Premium In-Ear Hearing Device",
    brand: "Phonak",
    description: `
      The Premium In-Ear Hearing Device by Phonak offers an exceptional hearing experience with advanced sound processing technology and customizable settings. It is designed to provide optimal hearing support with features like tinnitus management, wind noise reduction, and automatic environment adaptation.
    `,
    price: 95999,
    discounted_price: 85999,
    stock_status: "In Stock",
    features: [
      "Advanced Sound Processing",
      "Customizable Settings",
      "Tinnitus Management",
      "Wind Noise Reduction",
      "Automatic Environment Adaptation"
    ],
    specifications: {
      type: "In-the-ear (ITE)",
      battery_life: "Up to 25 hours",
      warranty: "3 years",
      water_resistance: "IP57",
      bluetooth_version: "5.2",
      dimensions: "2.8 x 1.2 x 0.6 inches",
      weight: "0.4 ounces",
      color: "Black"
    },
    images: [
      { url: "/assets/product_2.avif", alt_text: "Front view" },
      { url: "/assets/product_3.avif", alt_text: "Side view" },
      { url: "/assets/product_4.avif", alt_text: "Back view" },
      { url: "/assets/product_1.avif", alt_text: "In-ear view" },
    ],
    terms_and_conditions: `
      The Premium In-Ear Hearing Device includes a 3-year warranty covering manufacturing defects. The warranty excludes damage from misuse or unauthorized modifications. Please refer to the user manual for proper usage instructions.
    `,
    refund_and_return_policy: `
      Returns are accepted within 30 days of purchase for a full refund, provided the product is returned in its original condition and packaging. Customers are responsible for return shipping costs. Refunds will be issued within 7-10 business days after receipt and inspection of the returned product.
    `,
    guarantee: `
      We stand by the quality and performance of the Premium In-Ear Hearing Device. For any issues, please reach out to our customer support team for assistance.
    `
  },
  // Add more products as needed
];

export default Dummy_Products;