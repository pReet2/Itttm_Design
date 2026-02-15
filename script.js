"use strict";

window.addEventListener( "load", function() {

// Variables
const faqCard = document.querySelector( ".faq-card" );
const faqList = document.querySelector( ".faq-list" );
const faqItems = [ ...document.querySelectorAll( ".faq-item" ) ];
const faqItemHeaders = [ ...document.querySelectorAll( ".faq-item-header" ) ];

// Functions
const displayActiveIcon = function( activeIcon, inactiveIcon ) {
  activeIcon.style.display = "block";
  inactiveIcon.style.display = "none";
}

const closeFaqItems = function() {
  faqItems.forEach( faqItem => {
    const closeHeight = faqItem.querySelector( ".faq-item-header" ).scrollHeight;
    faqItem.style.maxHeight = `${ closeHeight }px`;
    faqItem.dataset.openFaqList = false;
    displayActiveIcon(
      faqItem.querySelector( ".plus-icon" ),
      faqItem.querySelector( ".minus-icon" ) );
  } );
}

closeFaqItems();

// Faq Item Click Event
faqList.addEventListener( "click", function( event ) {
  if( event.target.closest( ".faq-item-header" ) ) {
    const targetFaqItem = event.target.closest( ".faq-item-header" ).closest( ".faq-item" );
    if( targetFaqItem.dataset.openFaqList === "false" ) {
      closeFaqItems();
      targetFaqItem.style.maxHeight = `${ targetFaqItem.scrollHeight }px`;
      targetFaqItem.dataset.openFaqList = true;
      displayActiveIcon(
        targetFaqItem.querySelector( ".minus-icon" ),
        targetFaqItem.querySelector( ".plus-icon" )
      );
    } else {
      closeFaqItems();
    }
  } 
} ); 

faqList.addEventListener( "keydown", function( event ) {
  if( event.target.closest( ".faq-item-header" ) && event.keyCode === 13 ) {
    const faqItem = event.target.closest( ".faq-item" );
    if( faqItem.dataset.openFaqList === "false" ) {
      closeFaqItems();
      faqItem.style.maxHeight = `${ faqItem.scrollHeight }px`;
      faqItem.dataset.openFaqList = true;
      displayActiveIcon(
        faqItem.querySelector( ".minus-icon" ),
        faqItem.querySelector( ".plus-icon" )
      );
    } else {
      closeFaqItems();
    }
  }
} );

// Resize Observer
let initialFaqCardWidth = faqCard.offsetWidth;

const resizeObserver = new ResizeObserver( entries => {
  for( const entry of entries ) {
    const { width } = entry.contentRect;
    if( initialFaqCardWidth !== width ) {
      faqItems.forEach( faqItem => {
        if( faqItem.dataset.openFaqList === "false" ) {
          const faqItemHeader = faqItem.querySelector( ".faq-item-header" );
          faqItem.style.maxHeight = `${ faqItemHeader.offsetHeight }px`;
        } else {
          faqItem.style.maxHeight = `${ faqItem.scrollHeight }px`;
        }
      } );
    }
  }
} );

resizeObserver.observe( faqCard );

} );


const GALLERY_ITEMS = [
  { id: '1', title: 'INS Vikrant at Sea', category: 'Fleet', imageUrl: 'https://picsum.photos/seed/ship1/800/600', description: 'The majestic aircraft carrier INS Vikrant conducting sea trials in the Arabian Sea.', date: 'Jan 2024' },
  { id: '2', title: 'MiG-29K Formation', category: 'Aviation', imageUrl: 'https://picsum.photos/seed/jet1/800/600', description: 'Precision flying by the MiG-29K fighter jets during a national day flypast.', date: 'Feb 2024' },
  { id: '3', title: 'Scorpène-class Stealth', category: 'Submarines', imageUrl: 'https://picsum.photos/seed/sub1/800/600', description: 'Silent and lethal: A Scorpène-class submarine surfacing near the western coast.', date: 'Dec 2023' },
  { id: '4', title: 'Naval Drill Excellence', category: 'Operations', imageUrl: 'https://picsum.photos/seed/ops1/800/600', description: 'Coordinated amphibious assault training exercise with international partners.', date: 'Mar 2024' },
  { id: '5', title: 'Guard of Honour', category: 'Personnel', imageUrl: 'https://picsum.photos/seed/crew1/800/600', description: 'Indian Naval personnel presenting the Guard of Honour during a state visit.', date: 'Jan 2024' },
  { id: '6', title: 'P-8I Poseidon Patrol', category: 'Aviation', imageUrl: 'https://picsum.photos/seed/plane1/800/600', description: 'Long-range maritime reconnaissance aircraft monitoring the Indian Ocean Region.', date: 'Nov 2023' },
  { id: '7', title: 'INS Kolkata Destroyer', category: 'Fleet', imageUrl: 'https://picsum.photos/seed/ship2/800/600', description: 'State-of-the-art guided-missile destroyer INS Kolkata on active patrol duty.', date: 'Apr 2024' },
  { id: '8', title: 'Divers in Action', category: 'Personnel', imageUrl: 'https://picsum.photos/seed/diver1/800/600', description: 'Highly trained Naval divers during a specialized underwater recovery operation.', date: 'Feb 2024' },
  { id: '9', title: 'Strategic Night Ops', category: 'Operations', imageUrl: 'https://picsum.photos/seed/night1/800/600', description: 'Visual of night-time operational readiness and surveillance capabilities.', date: 'May 2024' }
];

const categories = ['All', 'Fleet', 'Aviation', 'Submarines', 'Personnel', 'Operations'];
let currentCategory = 'All';
let currentLightboxIndex = 0;
let filteredItems = [...GALLERY_ITEMS];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const filterContainer = document.getElementById('filter-buttons');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lbTitle = document.getElementById('lb-title');
const lbCategory = document.getElementById('lb-category');
const lbDate = document.getElementById('lb-date');
const lbDesc = document.getElementById('lb-desc');
const zoomHint = document.getElementById('zoom-hint');

// Initialize Gallery
function init() {
  renderFilters();
  renderGallery();
  setupEventListeners();
}

function renderFilters() {
  filterContainer.innerHTML = categories.map(cat => `
    <button onclick="setCategory('${cat}')" class="filter-btn px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${cat === currentCategory ? 'bg-[#001f3f] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-[#001f3f]'}">
      ${cat}
    </button>
  `).join('');
}

function renderGallery() {
  filteredItems = currentCategory === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === currentCategory);
  
  if (filteredItems.length === 0) {
    galleryGrid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-400"><i class="fa-solid fa-camera-rotate text-5xl mb-4"></i><p>No images found.</p></div>`;
    return;
  }

  galleryGrid.innerHTML = filteredItems.map((item, index) => `
    <div onclick="openLightbox(${index})" class="gallery-item group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 animate-fade-in">
      <div class="relative h-64 overflow-hidden">
        <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-[#001f3f] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
        <div class="absolute top-4 right-4 bg-yellow-400 text-blue-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">${item.category}</div>
        <div class="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <p class="text-white font-bold text-lg mb-1">${item.title}</p>
          <p class="text-gray-300 text-xs line-clamp-2">${item.description}</p>
        </div>
      </div>
      <div class="p-4 flex justify-between items-center border-t border-gray-100">
        <span class="text-gray-400 text-[10px] font-semibold uppercase tracking-wider"><i class="fa-solid fa-calendar-days mr-1 text-yellow-600"></i> ${item.date}</span>
        <span class="text-[#001f3f] text-[10px] font-bold hover:text-yellow-600 transition-colors uppercase flex items-center gap-1">View <i class="fa-solid fa-arrow-right-long"></i></span>
      </div>
    </div>
  `).join('');
}

window.setCategory = (category) => {
  currentCategory = category;
  renderFilters();
  renderGallery();
};

window.openLightbox = (index) => {
  currentLightboxIndex = index;
  updateLightbox();
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

function updateLightbox() {
  const item = filteredItems[currentLightboxIndex];
  lightboxImg.src = item.imageUrl;
  lightboxImg.classList.remove('zoomed');
  zoomHint.innerText = 'Click to Zoom In';
  lbTitle.innerText = item.title;
  lbCategory.innerText = item.category;
  lbDate.innerText = item.date;
  lbDesc.innerText = item.description;
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

function nextImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
  updateLightbox();
}

function prevImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
  updateLightbox();
}

function setupEventListeners() {
  document.getElementById('close-btn').onclick = closeLightbox;
  document.getElementById('lightbox-backdrop').onclick = closeLightbox;
  document.getElementById('next-btn').onclick = (e) => { e.stopPropagation(); nextImage(); };
  document.getElementById('prev-btn').onclick = (e) => { e.stopPropagation(); prevImage(); };
  
  lightboxImg.onclick = () => {
    lightboxImg.classList.toggle('zoomed');
    zoomHint.innerText = lightboxImg.classList.contains('zoomed') ? 'Click to Zoom Out' : 'Click to Zoom In';
  };

  window.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

init();

document.addEventListener('DOMContentLoaded', () => {
  console.log('Indian Navy About Us Portal Initialized.');
});

function switchTab(tabId) {
  // Hide all content blocks
  const contentBlocks = ['mission', 'charter', 'policies'];
  contentBlocks.forEach(id => {
    document.getElementById(`content-${id}`).classList.add('hidden');
    
    // Reset button styles
    const btn = document.getElementById(`btn-${id}`);
    btn.classList.remove('active-tab');
    btn.classList.add('text-gray-500');
    
    const iconContainer = btn.querySelector('div');
    iconContainer.classList.remove('bg-yellow-400/20');
    iconContainer.classList.add('bg-gray-100');
  });

  // Show active content block
  const activeContent = document.getElementById(`content-${tabId}`);
  activeContent.classList.remove('hidden');

  // Highlight active button
  const activeBtn = document.getElementById(`btn-${tabId}`);
  activeBtn.classList.add('active-tab');
  activeBtn.classList.remove('text-gray-500');
  
  const activeIconContainer = activeBtn.querySelector('div');
  activeIconContainer.classList.remove('bg-gray-100');
  activeIconContainer.classList.add('bg-yellow-400/20');
}

function scrollToTabs(tabId) {
  const target = document.getElementById('about-tabs-section');
  target.scrollIntoView({ behavior: 'smooth' });
  switchTab(tabId);
}
