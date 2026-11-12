import { ShotLightboxGrid } from "./shot-lightbox";

// Extra screenshots shown under a case study, keyed by work entry slug. Files are
// pre-optimized WebP in public/work at 640 and 1200px, cropped to 16:10.

export type Shot = { src: string; alt: string; caption: string };

/**
 * Business projects are shown in two parts: the site customers use and the owner's
 * admin. Each part has its own set of screenshots.
 */
const splitGalleries: Record<string, { site: Shot[]; admin: Shot[] }> = {
  "kingsway-cuts": {
    site: [
      {
        src: "/work/kingsway-cuts-home",
        alt: "Kingsway Cuts home page: a dark photo of a barber at work behind the headline Sharp cuts. Straight talk. No rush., with Book a chair and See the menu buttons and Opens 9 a.m. tomorrow.",
        caption: "The home page, with booking one tap away.",
      },
      {
        src: "/work/kingsway-cuts-menu",
        alt: "The menu: a photo of straight-razor work beside a numbered price list, from a classic haircut at $38 and a skin fade at $45 to a hot towel shave at $42, each with a Book link.",
        caption: "The price list, where every service links straight to booking.",
      },
      {
        src: "/work/kingsway-cuts-slots",
        alt: "Booking a skin fade with Dani Reyes: barber cards, a week of days with Wednesday picked, afternoon and evening times with 2:45 p.m. selected, and a booking summary with the $45 price.",
        caption: "Pick a barber or the first one free, then an open time.",
      },
      {
        src: "/work/kingsway-cuts-walkin",
        alt: "Kingsway Cuts walk-in board: Walk-ins welcome, with the shop's status and the time the doors open.",
        caption: "The walk-in board shows the wait before customers leave home.",
      },
      {
        src: "/work/kingsway-cuts-mobile",
        alt: "Three phone screens: the home page with the Book a chair button, the price list from a classic haircut at $38, and Marcus Bell's barber card with a Book with Marcus button.",
        caption: "The same site on a phone.",
      },
    ],
    admin: [
      {
        src: "/work/kingsway-cuts-admin-today",
        alt: "The owner's Today view: bookings, still to come and booked value for the day, today's book by time and barber, the walk-in wait setting and the latest messages.",
        caption: "Today: the day's book, the walk-in wait and the latest messages.",
      },
      {
        src: "/work/kingsway-cuts-admin-walkins",
        alt: "The Walk-ins page: a Taking walk-ins switch, the wait in minutes and people waiting with plus and minus buttons, an optional note and an Update the site button.",
        caption: "The walk-in board, updated from the owner's phone.",
      },
      {
        src: "/work/kingsway-cuts-calendar",
        alt: "The owner's calendar for the day, with a column of appointments for each of the three barbers.",
        caption: "The calendar, one column per barber.",
      },
    ],
  },
  "harbourview-physio": {
    site: [
      {
        src: "/work/harbourview-physio-home",
        alt: "Harbourview Physio home page: the headline Move with less pain, at your own pace, a photo of a physiotherapist treating a patient's shoulder, and Book an appointment and Call buttons.",
        caption: "The home page, calm and clear, with booking up front.",
      },
      {
        src: "/work/harbourview-physio-treat",
        alt: "What we treat: photo cards for back and neck pain, sports injuries, after surgery, and dizziness and concussion, each with a short description.",
        caption: "What the clinic treats, in plain words.",
      },
      {
        src: "/work/harbourview-physio-booking",
        alt: "Booking an initial assessment: practitioner cards with Anika Shah picked, a week of days with Friday selected, open morning times with 8:45 a.m. chosen, and a summary with the $135 price.",
        caption: "Choose a practitioner or the first one free, then a time.",
      },
      {
        src: "/work/harbourview-physio-intake",
        alt: "The online health form: body areas to tick, a 0 to 10 pain scale and how long the pain has lasted, with a privacy note beside it.",
        caption: "The health form patients fill in before their first visit.",
      },
      {
        src: "/work/harbourview-physio-mobile",
        alt: "Three phone screens: the home page with the Book an appointment button, open times for Friday with 8:45 a.m. picked, and the What we treat list starting with back and neck pain.",
        caption: "The same site on a phone.",
      },
    ],
    admin: [
      {
        src: "/work/harbourview-physio-admin-today",
        alt: "The clinic's Today view: bookings and booked value for the day, today's book with completed visits, a note that two first visits are still waiting on a form, and the latest messages.",
        caption: "Today, with first visits still waiting on a form.",
      },
      {
        src: "/work/harbourview-physio-admin-intake",
        alt: "The Intake forms page: upcoming first visits without a form yet, the clinic's new patient health form, and forms recently received online.",
        caption: "Intake forms: who still has one to do, and what came in.",
      },
      {
        src: "/work/harbourview-physio-answers",
        alt: "A booking in the clinic admin with the patient's intake answers laid out under About this visit and Your health.",
        caption: "The answers, waiting on the booking.",
      },
    ],
  },
  "maple-paws-vet": {
    site: [
      {
        src: "/work/maple-paws-vet-home",
        alt: "Maple Paws Vet home page: the headline Vet visits your pet won't dread, a photo of a vet holding a small fluffy dog, and Book a visit and See our services buttons.",
        caption: "The home page, warm and friendly, with booking up front.",
      },
      {
        src: "/work/maple-paws-vet-pettype",
        alt: "Booking step one: photo cards for dog, cat and rabbit with Cat picked, then reasons for the visit with prices, from a $89 wellness exam to a $25 nail trim.",
        caption: "Booking starts with the pet, so only the right visits show.",
      },
      {
        src: "/work/maple-paws-vet-slots",
        alt: "Booking a cat's vaccination visit: vet cards with Dr. Ellie Tran, the cats-only vet, picked, a week of days with Wednesday selected, open times with 12:30 p.m. chosen, and a $65 summary.",
        caption: "Only the vets who see cats are offered, then an open time.",
      },
      {
        src: "/work/maple-paws-vet-team",
        alt: "Meet the team: photo cards for three vets and a vet technician, each with the pets they see, their days in the clinic and a Book with button.",
        caption: "The team, with the pets each one sees.",
      },
      {
        src: "/work/maple-paws-vet-mobile",
        alt: "Three phone screens: the home page with the Book a visit button, the pet and reason steps with Cat and Vaccination visit picked, and Dr. Hannah Brooks's card in Meet the team.",
        caption: "The same site on a phone.",
      },
    ],
    admin: [
      {
        src: "/work/maple-paws-vet-admin-today",
        alt: "The clinic's Today view: bookings and booked value for the day, today's book by pet and owner, a list of vaccinations due and the latest messages.",
        caption: "Today, with vaccinations due beside the day's book.",
      },
      {
        src: "/work/maple-paws-vet-admin-vaccinations",
        alt: "The Vaccinations due page: overdue vaccines by pet and owner, when each reminder went out, and Send again now and Book buttons.",
        caption: "Vaccinations due, with a reminder or a booking one tap away.",
      },
      {
        src: "/work/maple-paws-vet-pet",
        alt: "A pet record for Biscuit the beagle: vaccinations with due dates, profile details and the owner's contact.",
        caption: "Each pet's record, with vaccines and when they're due.",
      },
    ],
  },
  "northwind-coffee-ordering": {
    site: [
      {
        src: "/work/northwind-coffee-ordering-home",
        alt: "Northwind Coffee home page: Small-batch coffee, roasted by the harbour, a photo of beans pouring from the roaster, Order for pickup and See the menu buttons, and each café's opening time.",
        caption: "The café's own site, with ordering built in.",
      },
      {
        src: "/work/northwind-coffee-ordering-menu",
        alt: "Order for pickup: a choice of three cafés with Harbour Street picked, the espresso bar menu with photos and prices, and an order with a mocha and an almond croissant totalling $12.75.",
        caption: "Pick a café, tap what you want, and watch the order build.",
      },
      {
        src: "/work/northwind-coffee-ordering-options",
        alt: "A mocha's options sheet: Large, oat milk and an extra shot picked, with an Add to order button showing $8.25.",
        caption: "Size, milk and extras, with the price updating as you go.",
      },
      {
        src: "/work/northwind-coffee-ordering-pickup",
        alt: "Checkout: the order summary, the pickup café, Today or Tomorrow, and a grid of pickup times with 7:30 a.m. picked.",
        caption: "Choose a pickup time that suits the café's hours.",
      },
      {
        src: "/work/northwind-coffee-ordering-phone",
        alt: "Three phone screens: choosing size, milk and extras for a mocha, picking a pickup time, and the order page showing Ready for pickup.",
        caption: "On a phone, from the drink to Ready for pickup.",
      },
    ],
    admin: [
      {
        src: "/work/northwind-coffee-ordering-admin-kitchen",
        alt: "The kitchen screen: New, Preparing and Ready columns of pickup orders, a filter by café, and large Start and Picked up buttons.",
        caption: "The kitchen screen: new, preparing and ready.",
      },
      {
        src: "/work/northwind-coffee-ordering-admin-today",
        alt: "The café's Today view: orders today, still to make, waiting on the shelf and order value, a list of open orders by café, and the latest messages.",
        caption: "Today's orders across the three cafés.",
      },
      {
        src: "/work/northwind-coffee-ordering-qr",
        alt: "Location settings for a café: address, opening hours for each day, and a menu QR code with printable table cards.",
        caption: "Each café's hours and its printable QR menu.",
      },
    ],
  },
  "brightside-cleaning-quotes": {
    site: [
      {
        src: "/work/brightside-cleaning-quotes-home",
        alt: "Brightside Cleaning home page: A clean home at a fair price, with no surprises, a photo of a cleaner mopping a bright room, a from $145 price card, and Get an instant quote and Book a clean buttons.",
        caption: "The site leads with the instant quote.",
      },
      {
        src: "/work/brightside-cleaning-quotes-quote",
        alt: "The quote calculator: a two-bedroom home, a deep clean and every two weeks picked on the left, and a live price of $266.20 plus HST itemised line by line on the right.",
        caption: "Customers price the clean themselves, line by line.",
      },
      {
        src: "/work/brightside-cleaning-quotes-request",
        alt: "Request this quote: fields for name, email, phone and neighbourhood, up to three preferred days, a time of day and notes, beside the same price breakdown.",
        caption: "One short form sends the quote exactly as priced.",
      },
      {
        src: "/work/brightside-cleaning-quotes-services",
        alt: "What we clean: photo cards for a standard clean, deep clean, move in or move out and office clean, each with a typical price and time.",
        caption: "Every kind of clean with a typical price.",
      },
      {
        src: "/work/brightside-cleaning-quotes-mobile",
        alt: "Three phone screens: the home page with the Get a quote button, the kind of clean and how often steps, and the price breakdown totalling $300.81 per visit.",
        caption: "The same quote on a phone.",
      },
      {
        src: "/work/brightside-cleaning-quotes-photo-start",
        alt: "Quote from a photo, before any upload: a Choose photos button for up to three JPEG, PNG or WebP photos, an Analyze my photos button, and three sample photos to try: a busy kitchen, a living room and a bedroom with laundry.",
        caption: "Customers add up to three photos, or try a sample.",
      },
      {
        src: "/work/brightside-cleaning-quotes-photo",
        alt: "Quote from a photo: a kitchen photo analysed into rooms, size, clutter and condition, a suggested deep clean and two extras, each with a reason, next to the calculator's estimated range of $250 to $315 plus HST.",
        caption: "Quote from a photo: the AI fills in the calculator, and the price comes from the business's own price list.",
      },
    ],
    admin: [
      {
        src: "/work/brightside-cleaning-quotes-admin-today",
        alt: "The cleaning company's Today view: bookings and booked value for the day, today's cleans by crew, new leads waiting for a reply, and the latest messages.",
        caption: "Today: the day's cleans and the leads waiting for a reply.",
      },
      {
        src: "/work/brightside-cleaning-quotes-admin-leads",
        alt: "The Leads page: leads this month, win rate, open quotes and won this month, a follow up today list, and every lead with its area, job, value and status.",
        caption: "Every quote request in one leads inbox.",
      },
      {
        src: "/work/brightside-cleaning-quotes-lead",
        alt: "One lead, marked Won: the quote exactly as the customer saw it, their contact details and preferred days, and notes.",
        caption: "A won lead, with the quote the customer saw.",
      },
      {
        src: "/work/brightside-cleaning-quotes-photo-lead",
        alt: "A new lead that started from a photo: the quote the customer sent and a From a photo card with the analysis summary, marked Used as suggested.",
        caption: "Leads that started from a photo show what the AI saw and whether the customer changed it.",
      },
      {
        src: "/work/brightside-cleaning-quotes-pricing",
        alt: "The quote pricing editor: base prices by bedrooms, bathrooms or square feet, with a live preview of a sample job.",
        caption: "The owner edits prices with a live preview.",
      },
    ],
  },
};

export function getSplitGallery(slug: string) {
  return splitGalleries[slug];
}

const galleries: Record<string, { title: string; shots: Shot[] }> = {
  "northwind-coffee-website": {
    title: "A closer look",
    shots: [
      {
        src: "/work/northwind-coffee-website-shop",
        alt: "The shop page: coffee cards with bean photos, origin tags, roast level, tasting notes, what each coffee is best for and the price of a 340 g bag.",
        caption: "Every coffee with its origin, roast and tasting notes.",
      },
      {
        src: "/work/northwind-coffee-website-brew",
        alt: "Brew guides for pour-over, French press and espresso, each with a photo and the ratio, coffee dose, yield, grind and water temperature.",
        caption: "Brew guides with the numbers that matter.",
      },
      {
        src: "/work/northwind-coffee-website-cafes",
        alt: "Our cafés: photo cards for Harbour Street, the Roastery and Willow Row, each with the address and opening hours by day.",
        caption: "Three cafés, with photos and opening hours.",
      },
      {
        src: "/work/northwind-coffee-website-mobile",
        alt: "Three phone screens: the home page hero, the coffee list with Harbour Blend at $19, and the café cards with Harbour Street's hours.",
        caption: "The same site on a phone.",
      },
    ],
  },
  "harbourview-bakery-website": {
    title: "A closer look",
    shots: [
      {
        src: "/work/harbourview-bakery-website-menu",
        alt: "Our favourites: four photo cards for Country Sourdough at $9.50, Butter Croissant at $4.25, Cardamom Cinnamon Bun at $4.50 and Chocolate Chip Cookie at $3.25, each with a short description, above a See the full menu button.",
        caption: "Favourites with prices, each linking to the menu.",
      },
      {
        src: "/work/harbourview-bakery-website-recent",
        alt: "The Our menu page: section links for bread, pastries, sweets and celebration cakes, then the Bread section with a sourdough photo beside each loaf, its description and price.",
        caption: "The menu by category, with photos and prices.",
      },
      {
        src: "/work/harbourview-bakery-website-cakes",
        alt: "The top of the Custom cakes page: a Designed with you eyebrow, the Custom cakes heading, a line saying the cake team replies within two business days with sketches and a quote, a Start your order button, and a photo of a mint celebration cake with pink rosettes.",
        caption: "Custom cakes, designed with the customer.",
      },
      {
        src: "/work/harbourview-bakery-website-mobile",
        alt: "Three phone screens: the home page hero with Bread worth getting up early for, the Our favourites card for Country Sourdough at $9.50, and the celebration cakes section with sizes and prices.",
        caption: "The same site on a phone.",
      },
    ],
  },
  "docs-chat": {
    title: "A closer look",
    shots: [
      {
        src: "/work/docs-chat-chat",
        alt: "The Northwind Coffee home page with the support chat open in the corner: asked Can I pause my subscription?, it answers that a subscription can be paused for up to 3 months and cites Help center, p. 4.",
        caption: "The chat sits on the business's own site and cites its source.",
      },
      {
        src: "/work/docs-chat-source",
        alt: "The same answer with its source opened: the quoted passage from page 4 of the help center, with the sentence the answer came from highlighted.",
        caption: "One tap shows the exact passage behind the answer.",
      },
      {
        src: "/work/docs-chat-try",
        alt: "Try it with your PDF: a stand-in website with the chat answering from an uploaded help center PDF, saying standard shipping to the US costs $14 and takes 4 to 8 business days, citing page 2.",
        caption: "Upload a PDF and try the bot on a stand-in site.",
      },
      {
        src: "/work/docs-chat-booking-offer",
        alt: "A barbershop site with the chat open: asked Is Saturday afternoon open for a skin fade?, it replies with 12:00 PM, 2:30 PM and 3:00 PM and shows them as buttons.",
        caption: "As a booking receptionist: it checks the booking system and offers real open times.",
      },
      {
        src: "/work/docs-chat-booking-confirmed",
        alt: "The same chat after the visitor picked a time, gave a name and email and pressed Book it: the appointment is confirmed.",
        caption: "Nothing is booked until the visitor confirms.",
      },
      {
        src: "/work/docs-chat-install",
        alt: "How to install: a one-line script tag with a Copy snippet button, and steps for pasting it into Shopify, WordPress, Webflow and Squarespace.",
        caption: "One line of code adds it to any website.",
      },
      {
        src: "/work/docs-chat-mobile",
        alt: "Three phone screens: the coffee shop home page with the chat button in the corner, the chat answering a subscription question with the quoted passage open, and the install page with the snippet.",
        caption: "The same chat on a phone.",
      },
    ],
  },
  "paperwork-ai": {
    title: "A closer look",
    shots: [
      {
        src: "/work/paperwork-ai-home",
        alt: "Paperwork AI home page: the headline Stop typing invoices into spreadsheets, what it does in four points, and a Start a batch panel with a drop zone and a choice of invoices, receipts or custom fields.",
        caption: "Drop in invoices, receipts or forms to start a batch.",
      },
      {
        src: "/work/paperwork-ai-batch",
        alt: "A batch of 12 documents: totals for needs review, checks passed and approved, and a table of invoices and receipts where flagged ones show the failed check, such as Line items add up, Duplicates or Currency.",
        caption: "Every document is checked, and problems are flagged by name.",
      },
      {
        src: "/work/paperwork-ai-review",
        alt: "The review screen: a scanned cleaning invoice with the misread line highlighted, next to two failed checks explaining the math that doesn't add up and the editable fields with confidence scores.",
        caption: "Click a value to see exactly where it came from on the page.",
      },
      {
        src: "/work/paperwork-ai-export",
        alt: "The Export menu over the batch: Excel workbook, CSV with one row per document or per line item, Google Sheets CSV and JSON, for approved or all documents.",
        caption: "Export approved rows to Excel, CSV, Google Sheets or JSON.",
      },
      {
        src: "/work/paperwork-ai-receipts-batch",
        alt: "Receipts mode: three job receipts from a lumber yard, a fuel stop and an equipment rental, a By suggested category summary with totals for materials, fuel, equipment rental, tools, safety gear and meals, and a table with each receipt's suggested category and checks.",
        caption: "Receipts mode: job receipts sorted into suggested expense categories for the bookkeeper.",
      },
      {
        src: "/work/paperwork-ai-receipts-review",
        alt: "A phone photo of a crumpled equipment rental receipt next to a failed Totals add up check (the printed total is 10.00 more than subtotal plus tax), the extracted fields, a suggested category of Equipment rental with its reason, and a job tag.",
        caption: "A misprinted total is caught, and the suggested category can be changed before approving.",
      },
      {
        src: "/work/paperwork-ai-mobile",
        alt: "Three phone screens: the home page headline and Start a batch panel, the batch totals and document list, and a scanned invoice with the misread line highlighted.",
        caption: "The same review on a phone.",
      },
    ],
  },
  "booking-assistant": {
    title: "A closer look",
    shots: [
      {
        src: "/work/booking-assistant-canvas",
        alt: "The n8n workflow in four colored sections: intake, AI reads the note, safe so send it, and not sure so ask the owner, plus a section for the owner's button taps.",
        caption: "The whole flow on one screen: each box is a simple step.",
      },
      {
        src: "/work/booking-assistant-telegram",
        alt: "Two phone screens of the owner's Telegram chat: a booking that needs a check, with the AI's notes, a draft reply and Approve and Hold buttons, and the same message after tapping Approve.",
        caption: "A tricky note waits for Approve or Hold, and the message updates after the tap.",
      },
      {
        src: "/work/booking-assistant-emails",
        alt: "Two confirmation emails: one written in French for a customer who wrote in French, and one that answers a customer's question about a colour treatment.",
        caption: "The reply is written in the customer's own language and answers their note.",
      },
      {
        src: "/work/booking-assistant-sheet",
        alt: "The run log in Google Sheets: one row per booking with a colored status such as Confirmed automatically, Confirmed after owner check, Held by owner and Needs attention.",
        caption: "Every booking is logged with its status and the reason.",
      },
      {
        src: "/work/booking-assistant-totals",
        alt: "The summary sheet with five bookings handled, 40 percent handled without a person and the AI cost, next to a calendar week showing two booked appointments.",
        caption: "Totals update by themselves, and appointments land on the calendar.",
      },
    ],
  },
  "customer-assistant": {
    title: "A closer look",
    shots: [
      {
        src: "/work/customer-assistant-regular",
        alt: "Three customer phone chats with a business account: opening hours answered after a typo-filled question, a French question answered in French, and a request for the exact address answered politely without giving it.",
        caption: "Customers message the business's regular account, typos and all. No bot to find.",
      },
      {
        src: "/work/customer-assistant-panel",
        alt: "Three screens of the owner's private admin chat: a question card with a draft reply and Send, Change and Don't answer buttons, the redrafted answer after a few rough words, and the sent answer with a Remember this option.",
        caption: "When it is not sure, the owner gets a draft in a private admin chat and approves with one tap.",
      },
      {
        src: "/work/customer-assistant-booking",
        alt: "A booking in three phone screens: the customer asks for a gel manicure tomorrow at 6 pm, the owner's admin chat shows a booking card with Approve, Other time and Full buttons, and the customer receives the confirmation.",
        caption: "A booking request becomes a card with Approve, Other time and Decline.",
      },
      {
        src: "/work/customer-assistant-sheet",
        alt: "Three Google Sheets tabs: opening hours with breaks, rules written as plain sentences, and the bookings list.",
        caption: "Hours, rules and bookings live in one Google Sheet. Change a cell and the next answer changes.",
      },
      {
        src: "/work/customer-assistant-calendar",
        alt: "A Google Calendar week showing a gel manicure booked for Friday 6 to 7 pm, next to the admin chat message saying the booking was added to Google Calendar.",
        caption: "Approved bookings land in the owner's own Google Calendar.",
      },
    ],
  },
  "workflow-runner": {
    title: "A closer look",
    shots: [
      {
        src: "/work/workflow-runner-run",
        alt: "A lead outreach run: six steps from lead intake to webhook, with the company lookup showing a simulated timeout and a retry with backoff, and a live log of every event.",
        caption: "Each step runs on a worker; a failed step retries with backoff, live.",
      },
      {
        src: "/work/workflow-runner-review",
        alt: "The review drawer: the AI's draft email to a fictional freight company with editable subject and message, a note field, and Reject or Save edits and send buttons, while the run waits at Human review.",
        caption: "The run pauses for a person to approve, edit or reject the draft.",
      },
      {
        src: "/work/workflow-runner-webhook",
        alt: "The mock webhook receiver: deliveries for an approved outreach email and an approved support reply, each with a valid signature and an idempotency key.",
        caption: "Approved results reach the receiving system once, with a signature it checks.",
      },
    ],
  },
  "shop-search": {
    title: "A closer look",
    shots: [
      {
        src: "/work/shop-search-home",
        alt: "shop-search home page: a mountain trail photo behind the headline Describe the gear you want. We turn it into filters you can edit, example queries, a sentence turned into filter chips, and the search box.",
        caption: "Type a sentence, get filters you can edit.",
      },
      {
        src: "/work/shop-search-results",
        alt: "Results for men's or unisex rain jacket between 100 and 250 bucks, not black: filter chips for jackets, men, unisex and $100 to $250, a note that not black couldn't be matched, and a grid of rain shells.",
        caption: "The request becomes chips, and what it can't match is said out loud.",
      },
      {
        src: "/work/shop-search-tents",
        alt: "Results for ultralight 2 person tent under 2kg: chips for tents, size 2P, under 2 kg and ultralight, the matching filters ticked on the left, and photo cards of two-person tents with prices.",
        caption: "Weight, size and category from one plain sentence.",
      },
      {
        src: "/work/shop-search-mobile",
        alt: "Three phone screens: the home page with the search box, tent results under the filter chips, and the filters drawer with Tents ticked and a Show 37 results button.",
        caption: "On a phone, with the filters in a drawer.",
      },
    ],
  },
  "freelance-site": {
    title: "A closer look",
    shots: [
      {
        src: "/work/freelance-site-home",
        alt: "The home page of this site: a dark hero with the headline Websites and smart tools for small businesses, Start a project and See my work buttons, a collage of project screenshots, and a row of credentials below.",
        caption: "The home page says who it's for in one line.",
      },
      {
        src: "/work/freelance-site-projects",
        alt: "The Projects page filtered to Booking and scheduling: category chips with counts, and project cards for Kingsway Cuts and Harbourview Physio with screenshots.",
        caption: "Projects filter by what a client needs.",
      },
      {
        src: "/work/freelance-site-project",
        alt: "A project page for Northwind Coffee Co.: breadcrumbs, the title and summary, category and stack tags, and a screenshot of the site beside them.",
        caption: "Each project page leads with the problem and a picture.",
      },
      {
        src: "/work/freelance-site-contact",
        alt: "The contact page: a Tell me about your project form with name, email, business and what you need as tappable options, beside a What happens next panel with three steps.",
        caption: "A short contact form, with what happens next spelled out.",
      },
      {
        src: "/work/freelance-site-mobile",
        alt: "Three phone screens: the home page hero, the About page with a photo, and the screenshot gallery on a project page.",
        caption: "The same site on a phone.",
      },
    ],
  },
  "site-rescue": {
    title: "Before and after",
    shots: [
      {
        src: "/work/site-rescue-before",
        alt: "The bakery home page before: a shouting holiday banner, a script logo, a gray Home title band and a slider with arrows.",
        caption: "Before: a slider, a script-injected banner and a 47.0 MB page.",
      },
      {
        src: "/work/site-rescue-after",
        alt: "The bakery home page after: a calm banner, the menu with the current page marked, and a full-width bread photo with the headline Bread worth getting up early for and two buttons.",
        caption: "After: same theme and editor, refreshed design, one fast hero photo.",
      },
    ],
  },
};


export function WorkGallery({ slug }: { slug: string }) {
  const gallery = galleries[slug];
  if (!gallery) return null;
  return (
    <section aria-labelledby="gallery-heading" className="mt-16 border-t border-border pt-12">
      <h2 id="gallery-heading" className="text-[1.375rem] font-semibold leading-tight tracking-tight">
        {gallery.title}
      </h2>
      <ShotGrid shots={gallery.shots} />
    </section>
  );
}

/** Two-column grid of 16:10 screenshots with captions; each opens larger on click. */
export function ShotGrid({ shots }: { shots: Shot[] }) {
  return <ShotLightboxGrid shots={shots} />;
}
