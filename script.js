
// State
let rooms = JSON.parse(localStorage.getItem('insane_rooms')) || [];
let currentRoomId = localStorage.getItem('insane_current_room_id') || null;
let currentCharacterId = localStorage.getItem('insane_current_char_id') || null;
let isLibraryExpanded = false; // Default to Compact Mode
let isBigFormat = localStorage.getItem('insane_big_format') === 'true'; // New state

// DOM Elements
const madnessContainer = document.getElementById('madness-container');
const librarySection = document.getElementById('library-section');
const activeRoomContent = document.getElementById('active-room-content');
const noRoomMsg = document.getElementById('no-room-msg');
const currentRoomName = document.getElementById('current-room-name');
const createRoomBtn = document.getElementById('create-room-btn');
const roomNameInput = document.getElementById('room-name-input');
const roomSelectDropdown = document.getElementById('room-select-dropdown');
const deleteRoomBtn = document.getElementById('delete-room-btn');
const bigFormatToggle = document.getElementById('big-format-toggle'); // New Toggle

const clearDeckBtn = document.getElementById('clear-deck-btn');
const shuffleDeckBtn = document.getElementById('shuffle-deck-btn');
const drawResultOverlay = document.getElementById('draw-result-overlay');
const drawnCardsDisplay = document.getElementById('drawn-cards-display');
const closeDrawBtn = document.getElementById('close-draw-btn');

const deckCountSpan = document.getElementById('deck-count');
const deckList = document.getElementById('deck-list');
const deck3dStack = document.getElementById('deck-3d-stack');
const categoryFilter = document.getElementById('category-filter');
const librarySearchInput = document.getElementById('library-search-input');
const toggleLibraryViewBtn = document.getElementById('toggle-library-view-btn');
const libraryModeLabel = document.getElementById('library-mode-label');

// Random Add Controls
const addRandomBtn = document.getElementById('add-random-btn');
// Dialog Elements
const randomDialog = document.getElementById('random-dialog');
const dialogRandomCount = document.getElementById('dialog-random-count');
const dialogRandomCategory = document.getElementById('dialog-random-category');
const dialogConfirmBtn = document.getElementById('dialog-confirm-btn');
const dialogCancelBtn = document.getElementById('dialog-cancel-btn');

// Avatar Modal Elements
const avatarModal = document.getElementById('avatar-modal');
const avatarColorGrid = document.getElementById('avatar-color-grid');
const avatarEmojiInput = document.getElementById('avatar-emoji-input');
const avatarCancelBtn = document.getElementById('avatar-cancel-btn');
const avatarConfirmBtn = document.getElementById('avatar-confirm-btn');
const avatarColorPicker = document.getElementById('avatar-color-picker');
const avatarPreview = document.getElementById('avatar-preview');
const avatarPreviewEmoji = document.getElementById('avatar-preview-emoji');
let editingAvatarCharId = null;
let selectedAvatarColor = '';

// Session Info Elements
const sessionInfoBtn = document.getElementById('session-info-btn');
const sessionInfoWindow = document.getElementById('session-info-window');
const closeSessionInfoBtn = document.getElementById('close-session-info');
const sessionInfoContent = document.getElementById('session-info-content');
const sessionInfoHeader = document.getElementById('session-info-header');

// Library Toggle Button
const libraryToggleBtn = document.getElementById('library-toggle-btn');

// Character Elements
const addCharBtn = document.getElementById('add-char-btn');
const characterListDiv = document.getElementById('character-list');

// Resizer (Removed)
// const libraryResizer = document.getElementById('library-resizer');

// Modal Elements
const charModal = document.getElementById('char-modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-char-name');
const modalConfirm = document.getElementById('modal-confirm-btn');
const modalCancel = document.getElementById('modal-cancel-btn');
let editingCharId = null;

// Constants
const CHARACTER_COLORS = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', 
    '#3498db', '#9b59b6', '#34495e', '#7f8c8d'
];

// Global Toast
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Library Toggle Logic
if (libraryToggleBtn) {
    libraryToggleBtn.addEventListener('click', () => {
        librarySection.classList.toggle('hidden');
        
        // Ensure resizers are shown/hidden
        // Resizer AFTER library is handled by CSS .library-section.hidden + .resizer
        // Resizer BEFORE library (resizer-deck-library) is handled by :has() in CSS
        // But for safety, let's toggle class on resizer-deck-library
        const deckResizer = document.getElementById('resizer-deck-library');
        if (deckResizer) {
             if (librarySection.classList.contains('hidden')) {
                 deckResizer.classList.add('hidden');
             } else {
                 deckResizer.classList.remove('hidden');
             }
        }
    });
}

// Initial state check
// Library is hidden by default in HTML


// Add click listener to hot zone as well? No, hot zone is just for revealing.
// But if the button is small, maybe clicking hotzone near button should work?
// User said "click the triangle".

// Make sure sidebar button is correctly hidden/shown on collapse state change
// In handleResize:
// if (newWidth < COLLAPSE_THRESHOLD) { librarySection.classList.add('collapsed'); showLibraryBtn.classList.remove('hidden'); }
// Wait, my previous code removed 'hidden' class.
// My CSS for #show-library-btn has `opacity: 0` by default.
// So removing 'hidden' just puts it in DOM but invisible until .visible is added.
// This matches the "invisible unless hovered" behavior I implemented.
// User says "still invisible". Maybe they mean they can't see it AT ALL even when collapsed?
// Ah, "Hot zone" logic requires mouse to be exactly on the 5px edge.
// Maybe make it visible (low opacity) by default when collapsed, so they know it's there?
// Or maybe the `collapsed` class isn't being added correctly?

// Let's modify handleResize to ensure consistency.


// Initialization
function init() {
    // Init Toggle State
    if (bigFormatToggle) {
        bigFormatToggle.checked = isBigFormat;
        bigFormatToggle.addEventListener('change', (e) => {
            isBigFormat = e.target.checked;
            localStorage.setItem('insane_big_format', isBigFormat);
            // Refresh Library and Filter
            renderCategoryFilter();
            renderMadnessCards();
            // Refresh Deck Visuals (Stack) to update back image
            const room = getCurrentRoom();
            if (room) updateDeckVisuals(room);
            // Refresh Random Dialog Categories
            populateRandomDialogCategories();
        });
    }

    renderCategoryFilter();
    renderMadnessCards();
    updateRoomDropdown();
    
    // Populate Random Range Select (Dialog)
    // NOTE: This needs to be dynamic based on current data source
    populateRandomDialogCategories();

    if (currentRoomId) {
        if (rooms.find(r => r.id === currentRoomId)) {
            selectRoom(currentRoomId);
        } else {
            currentRoomId = null;
            updateRoomUI();
        }
    } else if (rooms.length > 0) {
        selectRoom(rooms[0].id);
    } else {
        updateRoomUI();
    }
    
    // Mobile Library Close
    const mobileLibraryCloseBtn = document.getElementById('mobile-library-close-btn');
    if (mobileLibraryCloseBtn) {
        mobileLibraryCloseBtn.addEventListener('click', () => {
            librarySection.classList.remove('active');
            toggleBackdrop(false);
        });
    }

    // Fix for "Clicking anywhere triggers input focus"
    // Forces blur if clicking on non-interactive elements while an input is focused.
    document.addEventListener('click', (e) => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            // Allow clicking the input itself or its label
            if (e.target === active || (e.target.tagName === 'LABEL' && e.target.control === active)) {
                return;
            }
            // Allow clicking other interactive elements
            if (['BUTTON', 'SELECT', 'A', 'SUMMARY', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                return;
            }
            // If clicking inside a container that handles input (like a custom dropdown), check up the tree?
            // For this app, inputs are simple. Blurring on background click is safe.
            active.blur();
        }
    }, { passive: true });

    // Mobile Bottom Navigation Logic
    const mobileNavDeck = document.getElementById('mobile-nav-deck');
    const mobileNavLibrary = document.getElementById('mobile-nav-library');
    const deckContentColumn = document.getElementById('deck-content-column');
    
    // Create Backdrop if not exists
    let drawerBackdrop = document.querySelector('.drawer-backdrop');
    if (!drawerBackdrop) {
        drawerBackdrop = document.createElement('div');
        drawerBackdrop.className = 'drawer-backdrop';
        document.body.appendChild(drawerBackdrop);
        drawerBackdrop.addEventListener('click', () => {
            toggleBackdrop(false);
            if (deckContentColumn) deckContentColumn.classList.remove('active');
            if (librarySection) librarySection.classList.remove('active');
            
            if (mobileNavDeck) mobileNavDeck.classList.remove('active');
            if (mobileNavLibrary) mobileNavLibrary.classList.remove('active');
        });
    }

    function toggleBackdrop(show) {
        if (show) drawerBackdrop.classList.add('active');
        else drawerBackdrop.classList.remove('active');
    }

    if (mobileNavDeck) {
        mobileNavDeck.addEventListener('click', () => {
            if (mobileNavDeck.classList.contains('active')) {
                // Close if already active
                deckContentColumn.classList.remove('active');
                mobileNavDeck.classList.remove('active');
                toggleBackdrop(false);
            } else {
                // Open
                deckContentColumn.classList.add('active');
                librarySection.classList.remove('active');
                toggleBackdrop(true);
                
                mobileNavDeck.classList.add('active');
                mobileNavLibrary.classList.remove('active');
            }
        });
    }

    if (mobileNavLibrary) {
        mobileNavLibrary.addEventListener('click', () => {
            if (mobileNavLibrary.classList.contains('active')) {
                // Close if already active
                librarySection.classList.remove('active');
                mobileNavLibrary.classList.remove('active');
                toggleBackdrop(false);
            } else {
                // Open
                librarySection.classList.add('active');
                deckContentColumn.classList.remove('active');
                toggleBackdrop(true);

                mobileNavLibrary.classList.add('active');
                mobileNavDeck.classList.remove('active');
                
                // Force Tile Mode (Expanded) on Mobile
                setLibraryMode(true);
            }
        });
    }

    // Header Scroll Effect (Mobile)
    const scrollContainers = [document.getElementById('deck-list'), document.getElementById('madness-container')];
    const header = document.querySelector('.app-header');
    
    function handleScroll(e) {
        if (e.target.scrollTop > 8) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    scrollContainers.forEach(container => {
        if (container) {
            // Throttle scroll event (16ms)
            let lastKnownScrollPosition = 0;
            let ticking = false;
            
            container.addEventListener('scroll', (e) => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        handleScroll(e);
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    });

    initAvatarModal();
    initSessionInfo();
    
    // Mobile Header Logic
    const mobileCreateBtn = document.getElementById('mobile-create-room-btn');
    const mobileRoomSelect = document.getElementById('mobile-room-select');
    // const mobileInfoBtn = document.getElementById('mobile-session-info-btn'); // Removed
    const mobileDeleteBtn = document.getElementById('mobile-delete-room-btn');
    const mobileBigFormatCheckbox = document.getElementById('big-format-toggle-mobile');

    // Create Room Modal Elements
    const createRoomModal = document.getElementById('create-room-modal');
    const createRoomModalInput = document.getElementById('create-room-modal-input');
    const createRoomModalConfirm = document.getElementById('create-room-modal-confirm');
    const createRoomModalCancel = document.getElementById('create-room-modal-cancel');

    if (mobileCreateBtn) {
        mobileCreateBtn.addEventListener('click', () => {
             createRoomModal.classList.remove('hidden');
             createRoomModalInput.focus();
        });
    }

    if (createRoomModalCancel) {
        createRoomModalCancel.addEventListener('click', () => {
            createRoomModal.classList.add('hidden');
        });
    }

    if (createRoomModalConfirm) {
        createRoomModalConfirm.addEventListener('click', () => {
            const roomName = createRoomModalInput.value.trim();
            if (roomName) {
                const newRoom = {
                    id: Date.now().toString(),
                    name: roomName,
                    deck: [],
                    characters: [] 
                };
                rooms.push(newRoom);
                saveData();
                updateRoomDropdown();
                selectRoom(newRoom.id);
                createRoomModalInput.value = '';
                createRoomModal.classList.add('hidden');
                showToast("房间已创建");
            } else {
                alert("请输入房间名");
            }
        });
    }

    if (mobileRoomSelect) {
        mobileRoomSelect.addEventListener('change', (e) => {
            if (e.target.value) selectRoom(e.target.value);
        });
    }

    /*
    if (mobileInfoBtn) {
        mobileInfoBtn.addEventListener('click', () => {
            sessionInfoBtn.click();
        });
    }
    */

    if (mobileDeleteBtn) {
        mobileDeleteBtn.addEventListener('click', () => {
            deleteRoomBtn.click();
        });
    }

    if (mobileBigFormatCheckbox) {
        // Sync initial state
        mobileBigFormatCheckbox.checked = isBigFormat;

        mobileBigFormatCheckbox.addEventListener('change', (e) => {
            // Update state directly
            isBigFormat = e.target.checked;
            localStorage.setItem('insane_big_format', isBigFormat);
            
            // Sync PC toggle if exists
            if (bigFormatToggle) bigFormatToggle.checked = isBigFormat;
            
            // Trigger updates
            renderCategoryFilter();
            renderMadnessCards();
            const room = getCurrentRoom();
            if (room) updateDeckVisuals(room);
            populateRandomDialogCategories();
        });
        
        // Ensure PC toggle also updates mobile checkbox
        if (bigFormatToggle) {
            bigFormatToggle.addEventListener('change', (e) => {
                mobileBigFormatCheckbox.checked = e.target.checked;
            });
        }
    }

    // Deck Close Button Logic
    const mobileDeckCloseBtn = document.getElementById('mobile-deck-close-btn');
    if (mobileDeckCloseBtn) {
        mobileDeckCloseBtn.addEventListener('click', () => {
            if (deckContentColumn) deckContentColumn.classList.remove('active');
            toggleBackdrop(false);
            if (mobileNavDeck) mobileNavDeck.classList.remove('active');
        });
    }
}

// Helper to get current data source
function getCurrentData() {
    return isBigFormat ? cardsData : oldCardsData;
}

// Populate Random Dialog Categories
function populateRandomDialogCategories() {
    dialogRandomCategory.innerHTML = '<option value="all">全部分组</option>';
    const data = getCurrentData();
    const categories = [...new Set(data.map(c => c.category))];
    categories.forEach(cat => {
        const catGroup = data.find(c => c.category === cat);
        const count = catGroup ? catGroup.cards.length : 0;
        
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${cat} (${count}张)`;
        dialogRandomCategory.appendChild(option);
    });
}

// Render Category Filter
function renderCategoryFilter() {
    categoryFilter.innerHTML = '<option value="all">全部狂气</option>';
    const data = getCurrentData();
    const categories = [...new Set(data.map(c => c.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

categoryFilter.addEventListener('change', () => {
    renderMadnessCards();
});

librarySearchInput.addEventListener('input', () => {
    renderMadnessCards();
});

// Library View Toggle
if (toggleLibraryViewBtn) {
    toggleLibraryViewBtn.addEventListener('click', () => {
        setLibraryMode(!isLibraryExpanded);
    });
}

// Resizable Panels Logic
const resizers = document.querySelectorAll('.resizer');

resizers.forEach(resizer => {
    let isResizing = false;
    let prevX = 0;
    
    // We bind these dynamically on mousedown to capture current context
    let leftPanel = null;
    let rightPanel = null;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        prevX = e.clientX;
        leftPanel = resizer.previousElementSibling;
        rightPanel = resizer.nextElementSibling;
        
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        // Add global listeners
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Touch Support for Resizing
    resizer.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        isResizing = true;
        prevX = e.touches[0].clientX;
        leftPanel = resizer.previousElementSibling;
        rightPanel = resizer.nextElementSibling;
        
        resizer.classList.add('resizing');
        // Prevent default to avoid scrolling while resizing
        e.preventDefault();
        
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    });

    function onMouseMove(e) {
        if (!isResizing) return;
        handleResizeMove(e.clientX);
    }
    
    function onTouchMove(e) {
        if (!isResizing) return;
        e.preventDefault(); // Stop scrolling
        handleResizeMove(e.touches[0].clientX);
    }

    function handleResizeMove(clientX) {
        const dx = clientX - prevX;
        prevX = clientX;
        
        // Identify which resizer this is
        if (resizer.id === 'resizer-char-deck') {
            // Dragging between Char (Left) and Deck (Right)
            // Resize Left Panel (Char)
            const newWidth = leftPanel.offsetWidth + dx;
            if (newWidth > 200 && newWidth < 500) {
                leftPanel.style.flex = `0 0 ${newWidth}px`;
            }
        } else if (resizer.id === 'resizer-deck-library') {
            // Dragging between Deck (Left) and Library (Right)
            // Resize Right Panel (Library) inversely
            
            // Calculate max available width to prevent pushing other columns off screen
            // Total = Char(280) + Deck(min 200) + Library(current) + 3D(320)
            // Available for Library = Window - Char - 3D - MinDeck
            // Note: Char and 3D might be resizable too, but we use their current offsetWidth
            
            const charCol = document.getElementById('character-column');
            const deck3dCol = document.getElementById('deck-3d-column');
            const charWidth = charCol ? charCol.offsetWidth : 280;
            const deck3dWidth = deck3dCol ? deck3dCol.offsetWidth : 320;
            const minDeckWidth = 200;
            
            const maxLibraryWidth = window.innerWidth - charWidth - deck3dWidth - minDeckWidth;
            
            let newWidth = rightPanel.offsetWidth - dx;
            
            // Cap width
            if (newWidth > maxLibraryWidth) newWidth = maxLibraryWidth;
            
            if (newWidth > 200 && newWidth < 800) {
                rightPanel.style.flex = `0 0 ${newWidth}px`;
                
                // Auto-switch Mode Logic
                // Threshold: 2x card width. Card width is 80px (small) or more in expanded.
                // Expanded card is roughly 160px? 
                // Let's say if width > 350px (approx 2 columns of expanded cards + gap), switch to grid.
                // If width < 350px, switch to list/compact.
                // Actually user said "2x card width". 
                // Let's use 360px as a safe threshold.
                if (newWidth >= 360 && !isLibraryExpanded) {
                    setLibraryMode(true);
                } else if (newWidth < 360 && isLibraryExpanded) {
                    setLibraryMode(false);
                }
            }
        } else if (resizer.id === 'resizer-library-3d') {
            // Dragging between Library (Left) and 3D (Right)
            // Resize Right Panel (3D) inversely?
            // Same logic: Resizer is on LEFT of 3D panel.
            const newWidth = rightPanel.offsetWidth - dx;
            if (newWidth > 250 && newWidth < 500) {
                rightPanel.style.flex = `0 0 ${newWidth}px`;
            }
        }
    }

    function onMouseUp() {
        stopResizing();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    function onTouchEnd() {
        stopResizing();
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }
    
    function stopResizing() {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
    }
});


// Initialize library mode correctly
function setLibraryMode(expanded) {
    isLibraryExpanded = expanded;
    if (isLibraryExpanded) {
        librarySection.classList.remove('compact');
        madnessContainer.classList.remove('compact-view');
        madnessContainer.classList.add('expanded-view');
        if(libraryModeLabel) libraryModeLabel.textContent = '平铺模式';
        // Ensure minimum width if manually toggled
        if (librarySection.offsetWidth < 360) {
            librarySection.style.flex = '0 0 360px';
        }
    } else {
        librarySection.classList.add('compact');
        madnessContainer.classList.remove('expanded-view');
        madnessContainer.classList.add('compact-view');
        if(libraryModeLabel) libraryModeLabel.textContent = '堆叠模式';
        // Allow shrinking
        if (librarySection.offsetWidth > 350) {
            librarySection.style.flex = '0 0 250px';
        }
    }
}

// Initial mode check (on load)
function checkLibraryMode() {
    setLibraryMode(isLibraryExpanded);
}

// Render Madness Cards (Library)
function renderMadnessCards() {
    const filterCategory = categoryFilter.value;
    const searchTerm = librarySearchInput.value.trim().toLowerCase();
    
    madnessContainer.innerHTML = '';
    const data = getCurrentData();
    const room = getCurrentRoom();
    
    // Count occurrences of each card name in the deck
    // FIX: Differentiate by format (Old vs New)
    // Key format: "CardName_Format"
    const deckCounts = {};
    if (room && room.deck) {
        room.deck.forEach(c => {
            const key = `${c.name}_${!!c.isNewFormat}`;
            deckCounts[key] = (deckCounts[key] || 0) + 1;
        });
    }

    data.forEach(categoryGroup => {
        if (filterCategory !== 'all' && categoryGroup.category !== filterCategory) return;

        categoryGroup.cards.forEach(card => {
            // Search Filter
            if (searchTerm) {
                const matchName = card.name.toLowerCase().includes(searchTerm);
                const matchEffect = card.effect.toLowerCase().includes(searchTerm);
                const matchTrigger = card.trigger.toLowerCase().includes(searchTerm);
                if (!matchName && !matchEffect && !matchTrigger) return;
            }

            const cardWithCategory = { ...card, category: categoryGroup.category };
            cardWithCategory.isNewFormat = isBigFormat;
            
            const cardEl = createCardElement(cardWithCategory);
            
            // Check if in deck (using precise key matching)
            // Current card format is determined by global 'isBigFormat' here
            const key = `${card.name}_${isBigFormat}`;
            const count = deckCounts[key] || 0;
            
            if (count > 0) {
                cardEl.classList.add('in-deck');
                const titleEl = cardEl.querySelector('.card-title');
                if (titleEl) {
                    titleEl.textContent = `${card.name} (x${count})`;
                }
            }

            cardEl.onclick = () => addToDeck(cardWithCategory);
            madnessContainer.appendChild(cardEl);
        });
    });
}

// Auto-scale removed in favor of scrollbar
function adjustCardFontSize(cardEl) {
    // Deprecated
}

// Helper for Long Press (Tablet)
function addLongPressHandler(element, callback) {
    let timer;
    const delay = 500; // 500ms for long press

    element.addEventListener('touchstart', (e) => {
        timer = setTimeout(() => {
            timer = null;
            // Trigger callback with coordinates from first touch
            const touch = e.touches[0];
            callback(touch.clientX, touch.clientY);
        }, delay);
    }, { passive: true });

    const cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    element.addEventListener('touchend', cancel);
    element.addEventListener('touchmove', cancel);
}

function createCardElement(card, isDeckItem = false) {
    const el = document.createElement('div');
    el.className = 'card insanity-card'; // Added insanity-card class as requested
    
    // REMOVED inner wrapper <div class="flex flex-col h-full"> 
    // because .card itself is now the flex column container.
    // This removes the redundant layer that was breaking flex-grow logic.

    // Card Back Logic
    const isNewFormat = card.isNewFormat !== undefined ? card.isNewFormat : isBigFormat;
    // Note: When adding to deck, we capture current 'isBigFormat'. 
    // But when rendering library, 'card.isNewFormat' might be just set.
    
    // For library display, we want to show the BACK of the card if it was unrevealed? 
    // No, library always shows face up.
    // But wait, the prompt says "Current madness uses card back...". 
    // This usually applies to the deck view (unrevealed state). 
    
    // However, if we want to support 3D flip effect in library (if implemented later), we need the back image.
    // Currently, createCardElement creates face-up cards.
    
    // Let's ensure the card element has data-back-img if needed.
    const backImg = isNewFormat ? 'img/【新ins】狂气卡背.png' : 'img/卡背.png';
    el.setAttribute('data-back-img', backImg);

    // Build Card HTML with Songti Fonts and Centered Labels
    el.innerHTML = `
            <h3 class="card-title">${card.name}</h3>
            <!-- English name hidden via CSS .card-eng display:none -->
            <p class="card-eng">${card.nameEn || ''}</p>
            <div class="card-text">
                <div class="card-trigger-section">
                    <span class="card-label">触发</span>
                    <p class="card-content-text">${card.trigger}</p>
                </div>
                <div class="card-effect-section">
                    <span class="card-label">效果</span>
                    <p class="card-content-text">${card.effect}</p>
                </div>
                ${card.remarks ? `<div class="card-remark" style="margin-top:auto">${card.remarks}</div>` : ''}
            </div>
    `;

    if (isDeckItem) {
        // Drag Handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        // Content handled by CSS ::before
        el.appendChild(dragHandle);

        // Overlay for delete (Now an X button)
        const closeBtn = document.createElement('div');
        closeBtn.className = 'card-close-btn';
        // Use SVG for perfect centering
        closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            removeFromDeck(card);
        };
        el.appendChild(closeBtn);
    } else {
        el.title = "点击加入牌堆";
        // Drag from Library
        el.setAttribute('draggable', 'true');
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            // Use text/plain for better compatibility, prefix with identifier
            e.dataTransfer.setData('text/plain', 'LIBRARY_CARD:' + JSON.stringify(card));
            e.dataTransfer.setData('source', 'library');
        });
    }

    // Context Menu for Copy Text
    el.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showCardContextMenu(e.clientX, e.clientY, card);
    };

    // Long Press for Tablet
    addLongPressHandler(el, (x, y) => {
        showCardContextMenu(x, y, card);
    });

    // Slider (Madness Library Feature) - REMOVED

    return el;
}

// Delete Confirm Modal
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const deleteConfirmBtnFinal = document.getElementById('delete-confirm-btn-final');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');
let pendingDeleteCharId = null;

function openDeleteConfirmModal(charId) {
    pendingDeleteCharId = charId;
    deleteConfirmModal.classList.remove('hidden');
}

if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => {
        deleteConfirmModal.classList.add('hidden');
        pendingDeleteCharId = null;
    });
}

if (deleteConfirmBtnFinal) {
    deleteConfirmBtnFinal.addEventListener('click', () => {
        if (pendingDeleteCharId) {
            deleteCharacter(pendingDeleteCharId);
            pendingDeleteCharId = null;
        }
        deleteConfirmModal.classList.add('hidden');
    });
}

function showCardContextMenu(x, y, card) {
    removeContextMenu();
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;

    const actions = [
        { 
            label: '复制文本', 
            action: () => {
                const text = `【${card.name}】\n触发：${card.trigger}\n效果：${card.effect}`;
                navigator.clipboard.writeText(text).then(() => {
                    // Optional: Feedback
                });
            }
        }
    ];

    actions.forEach(act => {
        const item = document.createElement('div');
        item.className = 'context-menu-item';
        item.textContent = act.label;
        item.onclick = () => {
            act.action();
            removeContextMenu();
        };
        menu.appendChild(item);
    });
    
    document.body.appendChild(menu);
    document.addEventListener('click', removeContextMenu, { once: true });
}

// Room Management
createRoomBtn.addEventListener('click', () => {
    const roomName = roomNameInput.value.trim();
    if (roomName) {
        const newRoom = {
            id: Date.now().toString(),
            name: roomName,
            deck: [],
            characters: [] 
        };
        rooms.push(newRoom);
        saveData();
        updateRoomDropdown();
        selectRoom(newRoom.id);
        roomNameInput.value = '';
    } else {
        alert("请输入房间名");
    }
});

roomSelectDropdown.addEventListener('change', (e) => {
    if (e.target.value) {
        selectRoom(e.target.value);
    }
});

deleteRoomBtn.addEventListener('click', () => {
    if (!currentRoomId) return;
    const room = getCurrentRoom();
    if(confirm(`确定要删除房间 "${room.name}" 吗?`)) {
        deleteRoom(currentRoomId);
    }
});

function updateRoomDropdown() {
    roomSelectDropdown.innerHTML = '<option value="">-- 切换房间 --</option>';
    const mobileSelect = document.getElementById('mobile-room-select');
    if (mobileSelect) mobileSelect.innerHTML = '<option value="">-- 房间 --</option>';

    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        if (room.id === currentRoomId) option.selected = true;
        roomSelectDropdown.appendChild(option);
        
        if (mobileSelect) {
            const mOption = option.cloneNode(true);
            mOption.selected = (room.id === currentRoomId);
            mobileSelect.appendChild(mOption);
        }
    });
}

function selectRoom(id) {
    currentRoomId = id;
    localStorage.setItem('insane_current_room_id', id);
    
    updateRoomDropdown();
    updateRoomUI();
}

function deleteRoom(id) {
    rooms = rooms.filter(r => r.id !== id);
    if (currentRoomId === id) {
        currentRoomId = rooms.length > 0 ? rooms[0].id : null;
    }
    saveData();
    updateRoomDropdown();
    updateRoomUI();
}

function getCurrentRoom() {
    return rooms.find(r => r.id === currentRoomId);
}

function updateRoomUI() {
    const room = getCurrentRoom();
    
    if (!room) {
        activeRoomContent.classList.add('hidden');
        noRoomMsg.classList.remove('hidden');
        currentRoomName.textContent = "未选择";
        return;
    }

    activeRoomContent.classList.remove('hidden');
    noRoomMsg.classList.add('hidden');
    currentRoomName.textContent = room.name;
    
    updateDeckVisuals(room);
    renderCharacters(room);
    updateSessionInfo(); // Ensure info is updated on UI refresh
}

// --- Character Management ---


addCharBtn.addEventListener('click', () => {
    editingCharId = null;
    modalTitle.textContent = "新建角色";
    modalInput.value = "";
    charModal.classList.remove('hidden');
    modalInput.focus();
});

modalCancel.addEventListener('click', () => {
    charModal.classList.add('hidden');
});

const AVATAR_EMOJIS = [
    '🧙‍♂️', '🧝‍♀️', '🧛‍♂️', '🧚‍♂️', '🧜‍♀️', '🧞‍♂️', '🧟‍♀️', '🦹‍♂️', '🕵️‍♀️', 
    '💂‍♂️', '👷‍♀️', '👮‍♂️', '👩‍🚀', '👨‍🎤', '👩‍🎤', '👨‍🏫', '👩‍🏫', '👨‍🏭', 
    '👸', '🤴', '🦸‍♀️', '🦹‍♀️', '🧙‍♀️', '🧝‍♂️', '🧛‍♀️', '🧟‍♂️', '🧞‍♀️'
];

modalConfirm.addEventListener('click', () => {
    const name = modalInput.value.trim();
    if (!name) return;

    if (editingCharId) {
        // Edit existing
        const room = getCurrentRoom();
        const char = room.characters.find(c => c.id === editingCharId);
        if (char) {
            char.name = name;
            saveData();
            renderCharacters(room);
        }
    } else {
        // Create new
        const room = getCurrentRoom();
        if (room) {
             if (!room.characters) room.characters = [];
             const color = CHARACTER_COLORS[Math.floor(Math.random() * CHARACTER_COLORS.length)];
             const emoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
             const newChar = {
                id: Date.now().toString(),
                name: name,
                color: color,
                emoji: emoji,
                cards: []
            };
            room.characters.push(newChar);
            saveData();
            selectCharacter(newChar.id);
            renderCharacters(room);
        }
    }
    charModal.classList.add('hidden');
});

function openRenameModal(char) {
    editingCharId = char.id;
    modalTitle.textContent = "修改角色名";
    modalInput.value = char.name;
    charModal.classList.remove('hidden');
    modalInput.focus();
}


// --- Card Preview Modal ---
    const cardPreviewModal = document.getElementById('card-preview-modal');
    const cardPreviewContainer = document.getElementById('card-preview-container');
    const cardPreviewCloseBtn = document.getElementById('card-preview-close-btn');

    function openCardPreviewModal(card) {
        if (!cardPreviewModal) return;
        
        // Populate Content
        cardPreviewContainer.innerHTML = `
        <div class="card preview-card-content">
            <div class="preview-header">
                <h3 class="card-title">${card.name}</h3>
                <p class="card-eng">${card.nameEn || ''}</p>
            </div>
            <div class="card-text">
                <div class="card-trigger-section">
                    <span class="card-label">触发</span>
                    <p class="card-content-text">${card.trigger}</p>
                </div>
                <div class="card-effect-section">
                    <span class="card-label">效果</span>
                    <p class="card-content-text">${card.effect}</p>
                </div>
                ${card.remarks ? `<div class="card-remark" style="margin-top:auto">${card.remarks}</div>` : ''}
            </div>
        </div>
    `;
        
        cardPreviewModal.classList.remove('hidden');
    }

    if (cardPreviewCloseBtn) {
        cardPreviewCloseBtn.onclick = () => {
            cardPreviewModal.classList.add('hidden');
        };
        // Close on clicking outside container
        cardPreviewModal.onclick = (e) => {
            if (e.target === cardPreviewModal) {
                cardPreviewModal.classList.add('hidden');
            }
        };
    }

    function renderCharacters(room) {
    characterListDiv.innerHTML = '';
    if (!room.characters) room.characters = [];
    
    room.characters.forEach((char, index) => {
        if (!char.color) char.color = CHARACTER_COLORS[index % CHARACTER_COLORS.length];
        if (!char.emoji) char.emoji = AVATAR_EMOJIS[index % AVATAR_EMOJIS.length];

        const charEl = document.createElement('div');
        charEl.className = 'character-card-container';
        charEl.dataset.charId = char.id;
        if (char.id === currentCharacterId) {
            charEl.classList.add('selected');
        }
        
        charEl.onclick = () => selectCharacter(char.id);

        charEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        charEl.addEventListener('drop', (e) => {
            e.stopPropagation();
            const uniqueId = e.dataTransfer.getData('text/plain');
            if (uniqueId) {
                moveCardFromDeckToChar(uniqueId, char.id);
            }
        });
        
        // --- 1. Info Section (Top 40%) ---
        const headerSection = document.createElement('div');
        headerSection.className = 'char-header-section';

        // Avatar
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'char-avatar-container';
        
        if (char.avatarImage) {
            avatarContainer.style.backgroundImage = `url('${char.avatarImage}')`;
            avatarContainer.style.backgroundSize = 'cover';
            avatarContainer.style.backgroundPosition = 'center';
            avatarContainer.style.backgroundColor = 'transparent';
        } else {
            avatarContainer.style.backgroundColor = char.color;
        }
        
        avatarContainer.onclick = (e) => {
             e.stopPropagation();
             openAvatarModal(char);
        };
        
        if (!char.avatarImage) {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'avatar-emoji';
            emojiSpan.textContent = char.emoji;
            avatarContainer.appendChild(emojiSpan);
        }
        headerSection.appendChild(avatarContainer);

        // Info Column
        const infoSection = document.createElement('div');
        infoSection.className = 'char-info-section';

        // Name Row
        const nameRow = document.createElement('div');
        nameRow.className = 'char-name-row';
        
        const nameSpan = document.createElement('h4');
        nameSpan.className = 'char-name';
        nameSpan.textContent = char.name;
        nameSpan.title = char.name;
        nameSpan.onclick = (e) => {
            e.stopPropagation();
            openRenameModal(char);
        };
        nameRow.appendChild(nameSpan);
        
        infoSection.appendChild(nameRow);

        // Tags / Meta
        const metaRow = document.createElement('div');
        metaRow.className = 'char-meta-row';
        
        const revealedCount = char.cards.filter(c => c.isRevealed).length;
        metaRow.innerHTML = `
            <span class="char-tag">狂气: ${char.cards.length}</span>
            ${revealedCount > 0 ? `<span class="char-tag" style="color:#E53935">已触发: ${revealedCount}</span>` : ''}
        `;
        
        infoSection.appendChild(metaRow);
        headerSection.appendChild(infoSection);
        
        // Delete Button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-char-btn';
        deleteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        deleteBtn.title = "删除角色";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            openDeleteConfirmModal(char.id);
        };
        headerSection.appendChild(deleteBtn);

        charEl.appendChild(headerSection);

        // --- 2. Madness Zone (Bottom) ---
        const handSection = document.createElement('div');
        handSection.className = 'char-hand-section';
        
        const gridInner = document.createElement('div');
        gridInner.className = 'char-hand-grid-inner';

        if (char.cards.length > 0) {
            char.cards.forEach(card => {
                const miniCard = document.createElement('div');
                miniCard.className = `char-mini-card ${card.isRevealed ? 'revealed' : ''}`;
                
                if (card.isRevealed) {
                    miniCard.textContent = card.name;
                } else {
                    const backImg = card.isNewFormat ? 'img/【新ins】狂气卡背.png' : 'img/卡背.png';
                    miniCard.style.backgroundImage = `url('${backImg}')`;
                    miniCard.style.backgroundSize = 'cover';
                }
                
                miniCard.onmouseenter = (e) => {
                    // Disable tooltip on touch devices (no hover capability)
                    if (!window.matchMedia('(hover: hover)').matches) return;

                    const rect = miniCard.getBoundingClientRect();
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerHTML = `<strong>${card.name}</strong><br>${card.effect}<br><em>${card.trigger}</em>`;
                    document.getElementById('tooltip-portal').appendChild(tooltip);
                    
                    const tipRect = tooltip.getBoundingClientRect();
                    let top = rect.top - tipRect.height - 8;
                    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
                    if (left < 10) left = 10;
                    if (left + tipRect.width > window.innerWidth - 10) left = window.innerWidth - tipRect.width - 10;
                    if (top < 10) top = rect.bottom + 8;
                    tooltip.style.top = `${top}px`;
                    tooltip.style.left = `${left}px`;
                    requestAnimationFrame(() => tooltip.classList.add('visible'));
                    miniCard._tooltipEl = tooltip;
                };
                
                miniCard.onmouseleave = (e) => {
                    if (miniCard._tooltipEl) {
                        miniCard._tooltipEl.remove();
                        miniCard._tooltipEl = null;
                    }
                };
                
                // Context Menu
                addLongPressHandler(miniCard, (x, y) => {
                    // Flag that long press occurred to prevent click
                    miniCard.dataset.longPressTriggered = 'true';
                    showContextMenu(x, y, card, char.id);
                });

                miniCard.addEventListener('touchstart', (e) => {
                    miniCard.dataset.longPressTriggered = 'false';
                    // Optional: Tooltip behavior for mobile can be removed or kept.
                    // If we want preview modal, we might not need tooltip on touch.
                }, {passive: true});
                
                miniCard.addEventListener('touchend', (e) => {
                    // Check if long press happened
                    if (miniCard.dataset.longPressTriggered === 'true') {
                         miniCard.dataset.longPressTriggered = 'false';
                         return;
                    }
                    
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTouchTime;
                    if (tapLength < 300 && tapLength > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        openCardPreviewModal(card);
                    }
                    lastTouchTime = currentTime;
                });

                miniCard.ondblclick = (e) => {
                    e.stopPropagation();
                    // Double click can also open preview or toggle reveal?
                    // Let's make it open preview for consistency
                    openCardPreviewModal(card);
                };
                
                miniCard.onclick = (e) => {
                    e.stopPropagation();
                    // Click opens preview
                    openCardPreviewModal(card);
                };

                miniCard.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showContextMenu(e.clientX, e.clientY, card, char.id);
                };
                
                gridInner.appendChild(miniCard);
            });
        }
        
        handSection.appendChild(gridInner);
        charEl.appendChild(handSection);
        characterListDiv.appendChild(charEl);
    });

    // Add Character Button Card
    const addBtn = document.createElement('div');
    addBtn.className = 'character-card-container add-char-card';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.title = '新建角色';
    addBtn.onclick = () => addCharBtn.click();
    characterListDiv.appendChild(addBtn);
}

// --- Context Menu ---
function showContextMenu(x, y, card, charId) {
    // Remove existing
    removeContextMenu();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    
    const actions = [
        { 
            label: card.isRevealed ? '隐藏 (翻面)' : '公开 (翻面)', 
            action: 'toggleReveal'
        },
        { 
            label: '复制文本', 
            action: 'copy'
        },
        { label: '放回牌堆顶部', action: 'top' },
        { label: '放回牌堆底部', action: 'bottom' },
        { label: '放回牌堆随机', action: 'random' },
        { label: '丢弃 (删除)', action: 'delete', danger: true }
    ];
    
    actions.forEach(act => {
        const item = document.createElement('div');
        item.className = `context-menu-item ${act.danger ? 'danger' : ''}`;
        item.textContent = act.label;
        item.onclick = () => {
            if (act.action === 'copy') {
                const text = `【${card.name}】\n触发：${card.trigger}\n效果：${card.effect}`;
                navigator.clipboard.writeText(text).then(() => {
                    showToast("已复制狂气文本");
                });
            } else if (act.action === 'toggleReveal') {
                card.isRevealed = !card.isRevealed;
                saveData();
                renderCharacters(getCurrentRoom());
            } else {
                handleCardAction(act.action, card, charId);
            }
            removeContextMenu();
        };
        menu.appendChild(item);
    });
    
    document.body.appendChild(menu);
    
    // Click elsewhere to close
    document.addEventListener('click', removeContextMenu, { once: true });
}

function removeContextMenu() {
    const existing = document.querySelector('.context-menu');
    if (existing) existing.remove();
}

function handleCardAction(action, card, charId) {
    const room = getCurrentRoom();
    const char = room.characters.find(c => c.id === charId);
    if (!room || !char) return;
    
    // Remove from hand
    char.cards = char.cards.filter(c => c.uniqueId !== card.uniqueId);
    
    if (action === 'delete') {
        // Just remove (already done)
    } else {
        // Return to deck
        const cardToReturn = { ...card, isRevealed: false }; // Reset revealed state?
        
        if (action === 'top') {
            room.deck.push(cardToReturn);
        } else if (action === 'bottom') {
            room.deck.unshift(cardToReturn);
        } else if (action === 'random') {
            const randIndex = Math.floor(Math.random() * (room.deck.length + 1));
            room.deck.splice(randIndex, 0, cardToReturn);
        }
    }
    
    saveData();
    renderCharacters(room);
    updateDeckVisuals(room);
}

function selectCharacter(id) {
    currentCharacterId = id;
    localStorage.setItem('insane_current_char_id', id);
    const room = getCurrentRoom();
    if (room) renderCharacters(room);
}

function deleteCharacter(id) {
    const room = getCurrentRoom();
    if (!room) return;
    room.characters = room.characters.filter(c => c.id !== id);
    if (currentCharacterId === id) {
        currentCharacterId = null;
    }
    saveData();
    renderCharacters(room);
}


// --- Avatar Modal Logic ---
let tempAvatarImage = null; // Removed upload input ref

function initAvatarModal() {
    // Populate colors
    avatarColorGrid.innerHTML = '';
    CHARACTER_COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.onclick = () => {
            selectAvatarColor(color);
            if(avatarColorPicker) avatarColorPicker.value = color; // Sync picker
            updateAvatarPreview();
        };
        avatarColorGrid.appendChild(swatch);
    });

    // Removed File Upload Listener logic

    // Real-time Color Picker
    if (avatarColorPicker) {
        avatarColorPicker.addEventListener('input', (e) => {
            selectedAvatarColor = e.target.value;
            // Remove selection from grid as we are customizing
            const swatches = avatarColorGrid.querySelectorAll('.color-swatch');
            swatches.forEach(s => s.classList.remove('selected'));
            updateAvatarPreview();
        });
    }
    
    // Real-time Emoji Preview
    if (avatarEmojiInput) {
        avatarEmojiInput.addEventListener('input', () => {
            updateAvatarPreview();
        });
    }

    avatarCancelBtn.addEventListener('click', () => {
        avatarModal.classList.add('hidden');
    });

    avatarConfirmBtn.addEventListener('click', () => {
        if (editingAvatarCharId) {
            const room = getCurrentRoom();
            const char = room.characters.find(c => c.id === editingAvatarCharId);
            if (char) {
                // Update Logic
                char.color = selectedAvatarColor;
                char.emoji = avatarEmojiInput.value.trim() || char.emoji;
                // Removed tempAvatarImage update logic for file upload
                
                // Simulate PUT API
                console.log(`PUT /api/roles/${char.id}/avatar`, { color: char.color });
                
                // Success Toast
                showToast("头像更新成功");
                
                saveData();
                renderCharacters(room);
            } else {
                showToast("头像更新失败，请重试");
            }
        }
        avatarModal.classList.add('hidden');
    });
}

function updateAvatarPreview() {
    if (!avatarPreview) return;
    
    // Update Color
    avatarPreview.style.backgroundColor = selectedAvatarColor || '#ccc';
    
    // Update Image/Emoji
    if (tempAvatarImage) {
        avatarPreview.style.backgroundImage = `url('${tempAvatarImage}')`;
        avatarPreview.style.backgroundSize = 'cover';
        if(avatarPreviewEmoji) avatarPreviewEmoji.textContent = '';
    } else {
        avatarPreview.style.backgroundImage = 'none';
        if(avatarPreviewEmoji) avatarPreviewEmoji.textContent = avatarEmojiInput.value;
    }
}

function openAvatarModal(char) {
    editingAvatarCharId = char.id;
    selectedAvatarColor = char.color;
    avatarEmojiInput.value = char.emoji;
    
    // Reset temp image to current char image (for preview) or null
    // If we set it to char.avatarImage, it will show in preview.
    tempAvatarImage = char.avatarImage || null;
    
    // Set Picker Value
    if (avatarColorPicker) {
        // Check if color is hex, if not fallback to black (or convert if needed)
        // Basic check for #
        const colorVal = (selectedAvatarColor && selectedAvatarColor.startsWith('#')) ? selectedAvatarColor : '#000000';
        avatarColorPicker.value = colorVal;
    }
    
    // Highlight selected color
    selectAvatarColor(char.color);
    
    // Initial Preview Update
    updateAvatarPreview();
    
    avatarModal.classList.remove('hidden');
}

function selectAvatarColor(color) {
    selectedAvatarColor = color;
    const swatches = avatarColorGrid.querySelectorAll('.color-swatch');
    swatches.forEach(s => {
        s.classList.remove('selected');
        // Compare hex values roughly
        if (rgbToHex(s.style.backgroundColor).toLowerCase() === color.toLowerCase() || s.style.backgroundColor === color) {
             s.classList.add('selected');
        }
    });
}

// Helper to handle color comparison
function rgbToHex(col) {
    if(col.charAt(0)=='r'){
        col=col.replace('rgb(','').replace(')','').split(',');
        var r=parseInt(col[0], 10).toString(16);
        var g=parseInt(col[1], 10).toString(16);
        var b=parseInt(col[2], 10).toString(16);
        r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
        var colHex='#'+r+g+b;
        return colHex;
    }
    return col;
}


// --- Session Info Logic ---
function initSessionInfo() {
    sessionInfoBtn.addEventListener('click', () => {
        sessionInfoWindow.classList.remove('hidden');
        updateSessionInfo();
    });

    closeSessionInfoBtn.addEventListener('click', () => {
        sessionInfoWindow.classList.add('hidden');
    });

    // Prevent text selection and default drag behavior
    sessionInfoWindow.addEventListener('dragstart', (e) => e.preventDefault());
    sessionInfoWindow.addEventListener('selectstart', (e) => e.preventDefault());

    // Draggable Logic
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    sessionInfoHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = sessionInfoWindow.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragUp);
    });

    function onDragMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        sessionInfoWindow.style.left = `${initialLeft + dx}px`;
        sessionInfoWindow.style.top = `${initialTop + dy}px`;
    }

    function onDragUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragUp);
    }
    
    // Auto-hide Hand Info on outside click/touch
    document.addEventListener('touchstart', (e) => {
        // Check if touching inside a hand item wrapper or session info window
        // If NOT inside these, close all open details
        if (!e.target.closest('.char-hand-item-wrapper') && !e.target.closest('.session-info-window')) {
             const openDetails = document.querySelectorAll('.char-hand-item-wrapper > div:not(.char-hand-header):not(.hidden)');
             openDetails.forEach(el => el.classList.add('hidden'));
        }
    }, {passive: true});
    
    // Also support click for desktop
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.char-hand-item-wrapper') && !e.target.closest('.session-info-window')) {
             const openDetails = document.querySelectorAll('.char-hand-item-wrapper > div:not(.char-hand-header):not(.hidden)');
             openDetails.forEach(el => el.classList.add('hidden'));
        }
    });
}

function updateSessionInfo() {
    const room = getCurrentRoom();
    if (!room) return;

    // Calculations
    const deckCount = room.deck.length;
    
    let totalHands = 0;
    let drawnCount = 0; // Total drawn (in hands)
    
    // Map of CharName -> Count
    const charCounts = [];
    const charRevealed = [];

    room.characters.forEach(char => {
        const unrevealedCards = char.cards.filter(c => !c.isRevealed);
        const handSize = unrevealedCards.length;
        drawnCount += handSize;
        charCounts.push(`${char.name}: ${handSize}`);
        
        const revealed = char.cards.filter(c => c.isRevealed);
        if (revealed.length > 0) {
            const revealedNames = revealed.map(c => `【${c.name}】`).join('、');
            charRevealed.push(`${char.name}: ${revealedNames}`);
        }
    });

    const totalMadness = deckCount + drawnCount; // Total in play (Deck + Hands)

    // Build HTML - Compact Layout
    let html = `
        <div class="info-row compact">
            <div class="info-item"><span>总数:</span> <strong>${totalMadness}</strong></div>
            <div class="info-item"><span>未抽:</span> <strong>${deckCount}</strong></div>
            <div class="info-item"><span>已抽:</span> <strong>${drawnCount}</strong></div>
        </div>
        <div class="info-divider"></div>
        <div class="info-section-title">各角色手牌 (点击展开):</div>
        <div class="char-hand-list" style="display:flex; flex-direction:column; gap:4px;">
    `;

    if (charCounts.length === 0) {
        html += `<div style="color:#999; font-size:0.8rem;">无角色</div>`;
    } else {
        room.characters.forEach(char => {
            const unrevealedCards = char.cards.filter(c => !c.isRevealed);
            const handSize = unrevealedCards.length;
            let badgeClass = 'hand-count-badge';
            let badgeStyle = '';
            
            if (handSize === 3) {
                badgeStyle = 'background-color: #f1c40f; color: #333;'; // Yellow
            } else if (handSize >= 4) {
                badgeStyle = 'background-color: #e74c3c; color: white;'; // Red
            }

            // Prepare names
            const handNames = unrevealedCards.map(c => `【${c.name}】`).join(' ') || '无手牌';

            html += `
                <div class="char-hand-item-wrapper" style="border:1px solid #e5e7eb; border-radius:4px; background:white;">
                    <div class="char-hand-header" 
                         onclick="this.nextElementSibling.classList.toggle('hidden');" 
                         style="padding:4px 8px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background:#f9fafb;">
                        <span class="char-name-compact" title="${char.name}" style="font-weight:500;">${char.name}</span>
                        <span class="${badgeClass}" style="${badgeStyle}">${handSize}</span>
                    </div>
                    <div class="hidden" style="padding:4px 8px; font-size:0.75rem; color:#666; border-top:1px solid #eee; background:white;">
                        ${handNames}
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;

    html += `
        <div class="info-divider"></div>
        <div class="info-section-title">已触发狂气:</div>
    `;

    if (charRevealed.length === 0) {
        html += `<div style="color:#999; font-size:0.8rem;">无</div>`;
    } else {
        charRevealed.forEach(str => {
             // Split name and content
             const [name, content] = str.split(': ');
             html += `
                <div style="margin-bottom:4px; font-size:0.8rem;">
                    <span style="font-weight:bold;">${name}:</span>
                    <span style="color:#c0392b;">${content}</span>
                </div>
             `;
        });
    }

    // Update Desktop Window (if visible)
    if (!sessionInfoWindow.classList.contains('hidden')) {
        sessionInfoContent.innerHTML = html;
    }

    // Mobile Embed Update (Always)
    const mobileEmbed = document.getElementById('mobile-session-info-embed');
    if (mobileEmbed) {
        mobileEmbed.innerHTML = html;
        // Make sure hidden details are handled
        // Re-attach listeners for mobile embed
        const headers = mobileEmbed.querySelectorAll('.char-hand-header');
        headers.forEach(header => {
            header.onclick = function() {
                const detail = this.nextElementSibling;
                if(detail) detail.classList.toggle('hidden');
            };
        });
    }
}

// Hook updateSessionInfo into data changes
const originalSaveData = saveData;
saveData = function() {
    originalSaveData();
    updateSessionInfo(); // Update window if open
};

// Deck Management & Visuals
function addToDeck(card) {
    const room = getCurrentRoom();
    if (!room) {
        alert('请先新建或选择一个房间！');
        return;
    }
    const deckCard = { ...card, uniqueId: Date.now() + Math.random() };
    room.deck.push(deckCard);
    saveData();
    updateDeckVisuals(room);
    triggerDeckAnimation('add'); // Visual feedback
    renderMadnessCards(categoryFilter.value); // Refresh Library UI
}

function removeFromDeck(cardToRemove) {
    const room = getCurrentRoom();
    if (!room) return;
    room.deck = room.deck.filter(c => c.uniqueId !== cardToRemove.uniqueId);
    saveData();
    updateDeckVisuals(room);
    renderMadnessCards(categoryFilter.value); // Refresh Library UI
}

function clearDeck() {
    const room = getCurrentRoom();
    if (!room) return;
    if(confirm('确定要清空当前房间的牌堆吗？')) {
        room.deck = [];
        saveData();
        updateDeckVisuals(room);
        renderMadnessCards(); // Refresh library to clear counts/gray state
    }
}

function shuffleDeck() {
    const room = getCurrentRoom();
    if (!room || room.deck.length === 0) return;
    
    // Fisher-Yates Shuffle
    for (let i = room.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [room.deck[i], room.deck[j]] = [room.deck[j], room.deck[i]];
    }
    
    saveData();
    updateDeckVisuals(room);
}

if (clearDeckBtn) clearDeckBtn.addEventListener('click', clearDeck);
    if (shuffleDeckBtn) shuffleDeckBtn.addEventListener('click', shuffleDeck);
    
    // Mobile Buttons
    const shuffleDeckBtnMobile = document.getElementById('shuffle-deck-btn-mobile');
    const clearDeckBtnMobile = document.getElementById('clear-deck-btn-mobile');
    
    if (shuffleDeckBtnMobile) shuffleDeckBtnMobile.addEventListener('click', shuffleDeck);
    if (clearDeckBtnMobile) clearDeckBtnMobile.addEventListener('click', clearDeck);

// Deck List Drop Zone (for Library -> Deck AND Reordering to empty space)
deckList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

deckList.addEventListener('drop', (e) => {
    const source = e.dataTransfer.getData('source');
    
    // 1. Library -> Deck
    if (source === 'library') {
        let json = e.dataTransfer.getData('application/json');
        
        // Fallback for text/plain
        if (!json) {
            const text = e.dataTransfer.getData('text/plain');
            if (text && text.startsWith('LIBRARY_CARD:')) {
                json = text.substring('LIBRARY_CARD:'.length);
            }
        }

        if (json) {
            try {
                const cardData = JSON.parse(json);
                addToDeck(cardData);
            } catch (err) {
                console.error('Failed to parse card data', err);
            }
        }
        return;
    }
    
    // 2. Deck Reordering (Dropped on empty space -> Move to end)
    // Check if we dropped ON a card (handled by card's drop listener)
    // But events bubble up. If we are here, it might be bubbling from a card.
    // However, if the card's handler calls e.stopPropagation(), we won't reach here.
    // So if we reach here, we dropped on the container background.
    
    if (draggedItem && deckList.contains(draggedItem)) {
        e.preventDefault();
        const room = getCurrentRoom();
        const fromId = draggedItem.dataset.uniqueId;
        
        const fromIndex = room.deck.findIndex(c => c.uniqueId.toString() === fromId);
        
        if (fromIndex > -1) {
            // Move to END of deck (which is index 0 visually? No, visually top is end of array)
            // Wait, array order: [Bottom ... Top]
            // Visual order: [Top ... Bottom] (reversed)
            // So appending to array end = Top of deck = Top of list visually?
            // createCardElement adds to list.
            // updateDeckVisuals reverses deck: `const reversedDeck = [...room.deck].reverse();`
            // So index 0 in visual list is last element in array.
            // If I drop at the bottom of the visual list, I want it to be at the BOTTOM of the deck (index 0 of array).
            
            // Let's clarify:
            // Visual List:
            // 1. Card A (Top of Deck, Array[Last])
            // 2. Card B
            // ...
            // N. Card Z (Bottom of Deck, Array[0])
            
            // If I drop on empty space (usually at bottom of visual list), I expect it to go to the visual bottom?
            // Yes. Visual bottom = Array index 0.
            
            // Remove from old pos
            const [movedItem] = room.deck.splice(fromIndex, 1);
            
            // Insert at index 0 (Bottom of deck)
            room.deck.unshift(movedItem);
            
            saveData();
            updateDeckVisuals(room);
        }
    }
});

// Random Add Logic
addRandomBtn.addEventListener('click', () => {
    // Open Dialog
    randomDialog.classList.remove('hidden');
    dialogRandomCount.value = "5"; // Default
    dialogRandomCategory.value = "all";
});

dialogCancelBtn.addEventListener('click', () => {
    randomDialog.classList.add('hidden');
});

dialogConfirmBtn.addEventListener('click', () => {
    const room = getCurrentRoom();
    if (!room) {
        alert('请先新建或选择一个房间！');
        return;
    }
    
    let count = parseInt(dialogRandomCount.value) || 1;
    const range = dialogRandomCategory.value;
    const data = getCurrentData();
    
    let pool = [];
    if (range === 'all') {
        // Flatten all cards
        data.forEach(cat => {
            cat.cards.forEach(c => pool.push({...c, category: cat.category}));
        });
    } else {
        const catGroup = data.find(c => c.category === range);
        if (catGroup) {
            pool = catGroup.cards.map(c => ({...c, category: catGroup.category}));
        }
    }
    
    if (pool.length === 0) return;

    // Validate count against max
    if (count > pool.length) {
        alert(`该分组只有 ${pool.length} 张狂气，将全部加入。`);
        count = pool.length;
    }
    
    for(let i=0; i<count; i++) {
        // Random pick without replacement if user wants unique logic?
        // User said "抽取的狂气不能超过该分组的狂气数量上限" -> implies uniqueness or simply max cap.
        // Usually "random draw" implies taking from a finite deck.
        // Let's implement shuffle and take first N to ensure uniqueness within this draw batch.
        // But since this is "adding copies" to the deck, usually we just pick random.
        // However, "不能超过数量上限" suggests we treat the source as a finite pool for this operation.
        
        // Let's shuffle pool and take first N
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomCard = pool.splice(randomIndex, 1)[0]; // Remove to avoid duplicate in same batch
        
        // Add copy to room deck
        // FIX: Ensure randomly added cards have correct 'isNewFormat' flag
        // The pool already contains objects with 'category'. 
        // We need to inject 'isNewFormat' based on global toggle state at moment of addition.
        const deckCard = { 
            ...randomCard, 
            uniqueId: Date.now() + Math.random() + i,
            isNewFormat: isBigFormat // Inject current format state
        };
        
        room.deck.push(deckCard);
    }
    
    saveData();
    updateDeckVisuals(room);
    randomDialog.classList.add('hidden');
});

function updateDeckVisuals(room) {
    // 1. Update Count
    deckCountSpan.textContent = room.deck.length;

    // 2. Update Deck Contents List (Right Sub-area)
    deckList.innerHTML = '';
    if (room.deck.length === 0) {
        deckList.innerHTML = '<p class="empty-msg">牌堆为空</p>';
    } else {
        // Show newest first (which is the top of the deck)
        // Array order: [Bottom ... Top]
        // Display order: [Top ... Bottom]
        const reversedDeck = [...room.deck].reverse();
        
        reversedDeck.forEach((card, index) => {
            const cardEl = createCardElement(card, true);
            
            // Drag and Drop Attributes
            cardEl.setAttribute('draggable', 'true');
            // Store index in reversed array for visual purposes, but uniqueId is key
            cardEl.dataset.uniqueId = card.uniqueId;
            
            // Drag Events
            cardEl.addEventListener('dragstart', handleDragStart);
            cardEl.addEventListener('dragover', handleDragOver);
            cardEl.addEventListener('dragleave', handleDragLeave); // New
            cardEl.addEventListener('drop', handleDrop);
            cardEl.addEventListener('dragend', handleDragEnd);

            // Mobile Drag (Long Press on Handle ONLY)
            // Passing dragHandle as trigger, cardEl as target to clone
            const dragHandle = cardEl.querySelector('.drag-handle');
            if (dragHandle) {
                addMobileDragHandler(dragHandle, card, cardEl);
            }

            deckList.appendChild(cardEl);
        });
    }

    // 3. Update 3D Stack Visual (Left Sub-area)
    render3DStack(room.deck.length);
}

// --- Drag and Drop Logic ---
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.uniqueId);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual indicator based on mouse position
    const rect = this.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    
    // Remove both classes first
    this.classList.remove('drag-over-left', 'drag-over-right');
    
    if (offsetX < width / 2) {
        this.classList.add('drag-over-left');
    } else {
        this.classList.add('drag-over-right');
    }
    
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over-left', 'drag-over-right');
}

function handleDrop(e) {
        e.stopPropagation();
        
        // Cleanup classes
        this.classList.remove('drag-over-left', 'drag-over-right');
        
        const source = e.dataTransfer.getData('source');
        if (source === 'library') {
            let json = e.dataTransfer.getData('application/json');
            // Fallback for text/plain
            if (!json) {
                const text = e.dataTransfer.getData('text/plain');
                if (text && text.startsWith('LIBRARY_CARD:')) {
                    json = text.substring('LIBRARY_CARD:'.length);
                }
            }

            if (json) {
                try {
                    const cardData = JSON.parse(json);
                    addToDeck(cardData);
                } catch (err) { console.error(err); }
            }
            return false;
        }

    if (draggedItem !== this && draggedItem) {
        const room = getCurrentRoom();
        const fromId = draggedItem.dataset.uniqueId;
        const toId = this.dataset.uniqueId;
        
        const fromIndex = room.deck.findIndex(c => c.uniqueId.toString() === fromId);
        // We find toIndex later after removal to ensure correctness
        
        if (fromIndex > -1) {
            // Determine if inserting before or after based on mouse position at drop time
            const rect = this.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            // Visual indicator: Left = Before, Right = After
            // But logic was reversed? 
            // If dragging to LEFT half, we want to insert BEFORE (index remains same if moving from far away, or adjusts)
            
            const insertAfter = offsetX >= rect.width / 2;
            
            // Remove item first
            // Note: room.deck is array [Bottom ... Top]
            // Visual list is [Top ... Bottom] (reversed)
            
            // Wait! The visual list is rendered from `reversedDeck`.
            // So visual index 0 is deck[length-1].
            // If I drop "Before" visual item at index i, I am inserting "After" in the array (towards higher index)?
            // Let's trace indices.
            
            // Array: [A, B, C] (A=Bottom, C=Top)
            // Visual: [C, B, A]
            
            // If I drag A (visual bottom) to before C (visual top).
            // Visual target: C. Drop "Before" C (Left side of C).
            // Expected Visual: [A, C, B] (A becomes new top?) 
            // Wait, "Before" in LTR grid usually means "Left of".
            // In a wrapped grid, "Left" is lower index in the VISUAL list.
            // So "Before C" means new visual order: [A, C, B] ? No, [A, C, B] means A is index 0, C is 1.
            // If C was index 0. "Before C" -> New Item at index 0. C becomes index 1.
            // So Visual: [A, C, B]
            
            // Map Visual Index to Array Index:
            // Visual 0 -> Array N-1
            // Visual 1 -> Array N-2
            
            // This inversion makes "insert before visual" tricky if we operate on array directly.
            // Let's simplify: Operate on Reversed Array (Visual) then un-reverse?
            // Or calculate target Array index correctly.
            
            // Let's look at `toId`.
            let toIndexInArray = room.deck.findIndex(c => c.uniqueId.toString() === toId);
            
            // If Insert After (Visual Right side):
            // Visual: [C] -> Drop A right of C -> [C, A]
            // C was visual 0. A becomes visual 1.
            // Array: C was N-1. A becomes N-2.
            // So "Visual After" = "Array Lower Index" (closer to 0).
            
            // If Insert Before (Visual Left side):
            // Visual: [C] -> Drop A left of C -> [A, C]
            // A becomes visual 0. C becomes visual 1.
            // Array: A becomes N-1. C becomes N-2.
            // So "Visual Before" = "Array Higher Index" (closer to length).
            
            // Currently:
            // const [movedItem] = room.deck.splice(fromIndex, 1);
            // let newToIndex = room.deck.findIndex(...)
            // if (insertAfter) newToIndex++ 
            
            // This logic assumes `room.deck` matches visual order, but it's REVERSED.
            // We need to invert the logic for "After".
            
            // "Visual Left" (Before) -> We want to be "On Top" of target in Stack (Higher Array Index)
            // "Visual Right" (After) -> We want to be "Below" target in Stack (Lower Array Index)
            
            // Let's re-implement by manipulating the array to match visual intent.
            
            // 1. Remove from array
            const [movedItem] = room.deck.splice(fromIndex, 1);
            
            // 2. Find target's new index
            let targetIndex = room.deck.findIndex(c => c.uniqueId.toString() === toId);
            
            // 3. Calculate Insertion
            // If Visual Left (Before) -> We want A to appear before B in list.
            // List: [A, B]. Array: [..., B, A, ...] (since reversed)
            // So A should have HIGHER index than B.
            // targetIndex is B's index. We want A at targetIndex + 1.
            
            // If Visual Right (After) -> We want A to appear after B in list.
            // List: [B, A]. Array: [..., A, B, ...]
            // So A should have LOWER index than B.
            // targetIndex is B's index. We want A at targetIndex.
            
            // Wait, splice(index, 0, item) inserts AT index, shifting current item to index+1.
            // So:
            // Target B at index 5.
            // Visual Left (Before B) -> Array [..., B, A] -> A at 6? No, A at 6 means A is "Top".
            // Visual List: [Top, ..., Bottom]
            // Visual Left of B (Top) -> New Top -> Higher Array Index.
            // So "Visual Left" -> Insert at targetIndex + 1.
            // "Visual Right" -> Insert at targetIndex.
            
            // BUT: offsetX < width/2 is Left.
            // insertAfter = offsetX >= width/2 (Right).
            
            // So:
            // If insertAfter (Right) -> Insert at targetIndex.
            // If !insertAfter (Left) -> Insert at targetIndex + 1.
            
            // Let's apply this.
            
            if (insertAfter) {
                // Visual Right -> Array Lower Index -> Insert AT targetIndex (pushing target up to targetIndex+1)
                // Result: [A, Target] in array. 
                // Visual: [Target, A]. Correct.
                room.deck.splice(targetIndex, 0, movedItem);
            } else {
                // Visual Left -> Array Higher Index -> Insert AT targetIndex + 1.
                // Result: [Target, A] in array.
                // Visual: [A, Target]. Correct.
                room.deck.splice(targetIndex + 1, 0, movedItem);
            }
            
            saveData();
            updateDeckVisuals(room);
        }
    }
    return false;
}

function moveCardFromDeckToChar(cardUniqueId, charId) {
    const room = getCurrentRoom();
    const char = room.characters.find(c => c.id === charId);
    
    // Find card in deck
    const cardIndex = room.deck.findIndex(c => c.uniqueId.toString() === cardUniqueId);
    if (cardIndex > -1) {
        const [card] = room.deck.splice(cardIndex, 1);
        char.cards.push({ ...card, isRevealed: false });
        saveData();
        updateDeckVisuals(room);
        renderCharacters(room);
    }
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedItem = null;
}

// 3D Rendering Constants
const MAX_RENDER_LAYERS = 60; // Render up to 60 cards
const CARD_THICKNESS = 1.0; // Visual thickness per card (px)
const RANDOM_OFFSET_RANGE = 0.5; // +/- px - Reduced for subtle effect
const RANDOM_ROTATION_RANGE = 1; // +/- deg

// Animation Helper
function triggerDeckAnimation(type) {
    // type: 'add' or 'remove'
    const cls = `pulse-${type}`;
    deck3dStack.classList.remove('pulse-add', 'pulse-remove');
    // Trigger reflow
    void deck3dStack.offsetWidth;
    deck3dStack.classList.add(cls);
    
    // Remove after animation
    setTimeout(() => {
        deck3dStack.classList.remove(cls);
    }, 300);
}

// Seeded Random Helper
function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function render3DStack(count) {
    const topCard = deck3dStack.querySelector('.deck-top-card');
    const room = getCurrentRoom();
    
    // Clear existing layers
    const layers = deck3dStack.querySelectorAll('.deck-layer');
    layers.forEach(l => l.remove());
    
    if (count === 0 || !room || room.deck.length === 0) {
        const emptyPlaceholder = document.createElement('div');
        emptyPlaceholder.className = 'deck-layer empty-layer';
        emptyPlaceholder.textContent = 'Empty';
        deck3dStack.insertBefore(emptyPlaceholder, topCard);
        topCard.style.display = 'none';
        return;
    }
    
    topCard.style.display = 'flex';
    
    // Render Strategy:
    // Bottom Fixed: Z=0
    // Growing Upwards: Z increases with index
    // We limit to MAX_RENDER_LAYERS.
    // If deck > MAX, we render the *top* MAX cards, so the user sees the active part of the deck.
    // But visually we anchor the bottom of this "visible stack" to Z=0.
    
    const renderCount = Math.min(count, MAX_RENDER_LAYERS);
    // Determine the subset of deck to render (the top N cards)
    // deck array: [0: Bottom, ..., length-1: Top]
    // subset start index in real deck
    const subsetStartIndex = room.deck.length - renderCount; 
    
    // Loop through the cards BELOW the top card
    // i goes from 0 to renderCount - 2 (since top card is renderCount - 1)
    for (let i = 0; i < renderCount - 1; i++) {
        // Actual index in the room.deck array
        const realIndex = subsetStartIndex + i;
        const cardData = room.deck[realIndex];
        
        const layer = document.createElement('div');
        layer.className = 'deck-layer';
        
        // Background
        const backImg = (cardData.isNewFormat) ? 'img/【新ins】狂气卡背.png' : 'img/卡背.png';
        layer.style.backgroundImage = `url('${backImg}')`;
        
        // Z-Index: Higher index = Higher Z
        layer.style.zIndex = i;
        
        // Random Transform
        const seed = cardData.uniqueId.toString().split('').reduce((a,b)=>a+b.charCodeAt(0),0);
        const rndX = (seededRandom(seed) - 0.5) * 2 * RANDOM_OFFSET_RANGE;
        const rndY = (seededRandom(seed + 1) - 0.5) * 2 * RANDOM_OFFSET_RANGE;
        const rndRot = (seededRandom(seed + 2) - 0.5) * 2 * RANDOM_ROTATION_RANGE;
        
        // Position: Z grows up
        const zPos = i * CARD_THICKNESS;
        // XY Offset for staircase effect (Left-Up direction: negative X, negative Y)
        const xPos = i * -2; 
        const yPos = i * -2;
        
        layer.style.transform = `translate3d(${rndX + xPos}px, ${rndY + yPos}px, ${zPos}px) rotateZ(${rndRot}deg)`;
        
        // Brightness: Lower cards slightly darker
        const brightness = 0.8 + (i / renderCount) * 0.2;
        layer.style.filter = `brightness(${brightness})`;
        
        deck3dStack.insertBefore(layer, topCard);
    }
    
    // Top Card
    const topCardData = room.deck[room.deck.length - 1];
    const topSeed = topCardData.uniqueId.toString().split('').reduce((a,b)=>a+b.charCodeAt(0),0);
    const topRndRot = (seededRandom(topSeed + 2) - 0.5) * 2 * 0.5; // Less rotation for top
    
    // Top Card Z position
    const topZ = (renderCount - 1) * CARD_THICKNESS;
    const topX = (renderCount - 1) * -2;
    const topY = (renderCount - 1) * -2;
    
    // Reset animation state explicitly for new top card
    topCard.style.transition = 'none'; // Disable transition to snap
    topCard.style.opacity = '1';
    topCard.style.transform = `translate3d(${topX}px, ${topY}px, ${topZ}px) rotateZ(${topRndRot}deg)`;
    topCard.style.zIndex = renderCount; // On top
    
    const topBackImg = (topCardData.isNewFormat) ? 'img/【新ins】狂气卡背.png' : 'img/卡背.png';
    topCard.style.backgroundImage = `url('${topBackImg}')`;
    
    // Re-enable transition after a tick if needed, but 'performDraw' handles the animation logic.
    // The key is that when render3DStack is called (after draw), we want the NEW top card to appear instantly in place.
    
    updateDeckLighting();
}

// Mouse Move for Dynamic Lighting
document.addEventListener('mousemove', (e) => {
    // Throttle for performance
    requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1 to 1
        const dy = (e.clientY - cy) / cy; // -1 to 1
        
        // Update CSS Variables for lighting
        document.documentElement.style.setProperty('--light-x', -dx * 20 + 'px');
        document.documentElement.style.setProperty('--light-y', -dy * 20 + 'px');
        document.documentElement.style.setProperty('--sheen-opacity', 0.3 + (Math.abs(dx) + Math.abs(dy)) * 0.1);
        document.documentElement.style.setProperty('--sheen-pos', `${50 + dx * 50}% ${50 + dy * 50}%`);
    });
});

function updateDeckLighting() {
    // Just triggers CSS update if needed
}

// 3D Deck Click -> Draw for Character OR Show Top Card (if no char selected)
deck3dStack.addEventListener('click', (e) => {
    const room = getCurrentRoom();
    if (!room || room.deck.length === 0) {
        showToast("牌堆为空");
        return;
    }
    
    // Check if character selected
    if (currentCharacterId && room.characters.find(c => c.id === currentCharacterId)) {
        // Draw to character
        drawToCharacter(1);
    } else {
        // Show Top Card (Peek) without drawing
        showTopCard();
    }
});

function showTopCard() {
    const room = getCurrentRoom();
    if (!room || room.deck.length === 0) return;

    const topCard = room.deck[room.deck.length - 1];
    
    // Create a modal or overlay to show the card
    // We can reuse the drawResultOverlay but with a different title and no "drawn" logic
    drawnCardsDisplay.innerHTML = '';
    const cardEl = createCardElement(topCard);
    
    // Ensure card style matches Deck Content
    cardEl.classList.add('deck-preview-card'); // Add specific class if needed for override
    
    // Ensure text is visible and layout is correct
    const textSection = cardEl.querySelector('.card-text');
    if (textSection) textSection.style.display = 'flex'; 
    
    drawnCardsDisplay.appendChild(cardEl);
    
    const titleEl = drawResultOverlay.querySelector('h3');
    // Store original title to restore later if needed, or just set it
    // If we don't store it, it stays as "牌堆顶卡牌" until next draw resets it?
    // drawCards function sets overlay but doesn't set title?
    // Wait, drawResultOverlay usually has a static title in HTML?
    // Let's check HTML. I don't have HTML content. Assuming it has an H3.
    
    if (titleEl) {
        if (!titleEl.dataset.originalText) {
            titleEl.dataset.originalText = titleEl.textContent;
        }
        titleEl.textContent = "牌堆顶卡牌 (未抽取)";
    }
    
    drawResultOverlay.classList.remove('hidden');
    
    // Restore title on close
    const closeHandler = () => {
        if (titleEl && titleEl.dataset.originalText) {
            titleEl.textContent = titleEl.dataset.originalText;
        }
        closeDrawBtn.removeEventListener('click', closeHandler);
    };
    closeDrawBtn.addEventListener('click', closeHandler);
}

function drawToCharacter(count) {
    const room = getCurrentRoom();
    const char = room.characters.find(c => c.id === currentCharacterId);
    if (!room || !char || room.deck.length < count) return;
    
    // Animate Top Card if drawing 1
    const topCard = deck3dStack.querySelector('.deck-top-card');
    if (count === 1 && topCard && topCard.style.display !== 'none') {
        // Animation
        topCard.style.transition = 'all 0.3s ease-in';
        topCard.style.transform = 'translate3d(0, -200px, 100px) rotateZ(10deg)';
        topCard.style.opacity = '0';
        
        setTimeout(() => {
            performDraw();
        }, 250); // Slightly faster than transition to feel snappy
    } else {
        performDraw();
    }
    
    function performDraw() {
        for(let i=0; i<count; i++) {
            // Draw from Top (End of array)
            const card = room.deck.pop();
            
            // Add to character hand
            char.cards.push({
                ...card,
                isRevealed: false // Face down initially
            });
        }
        
        saveData();
        updateDeckVisuals(room);
        triggerDeckAnimation('remove'); // Visual feedback for stack
        renderCharacters(room);
    }
}

// Global Draw (No character selected or manual button click)
function drawCards(count) {
    const room = getCurrentRoom();
    if (!room || room.deck.length < count) return;
    
    if (currentCharacterId) {
        drawToCharacter(count);
        return;
    }

    // Animate Top Card if drawing 1
    const topCard = deck3dStack.querySelector('.deck-top-card');
    if (count === 1 && topCard && topCard.style.display !== 'none') {
        topCard.style.transition = 'all 0.3s ease-in';
        topCard.style.transform = 'translate3d(0, -200px, 100px) rotateZ(10deg)';
        topCard.style.opacity = '0';
        
        setTimeout(() => {
            performGlobalDraw();
        }, 250);
    } else {
        performGlobalDraw();
    }

    function performGlobalDraw() {
        const drawn = [];
        for(let i=0; i<count; i++) {
            if (room.deck.length === 0) break;
            // Draw from Top (End of array)
            const card = room.deck.pop();
            drawn.push(card);
        }
        
        saveData();
        updateDeckVisuals(room);
        triggerDeckAnimation('remove'); // Visual feedback
        
        // Show Overlay
        drawnCardsDisplay.innerHTML = '';
        drawn.forEach(card => {
            const cardEl = createCardElement(card);
            cardEl.querySelector('.card-text').style.display = 'block';
            drawnCardsDisplay.appendChild(cardEl);
        });
        drawResultOverlay.classList.remove('hidden');
    }
}

closeDrawBtn.addEventListener('click', () => {
    drawResultOverlay.classList.add('hidden');
});

// Storage
function saveData() {
    localStorage.setItem('insane_rooms', JSON.stringify(rooms));
}

// Edge Swipe to Close Modals / Library
document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;
    
    // Only detect swipe from left edge (first 30px)
    if (startX > 30) return;

    const handleTouchMove = (moveEvent) => {
        // Prevent default browser back if we are handling it
        // moveEvent.preventDefault(); 
    };

    const handleTouchEnd = (endEvent) => {
        const endX = endEvent.changedTouches[0].clientX;
        const endY = endEvent.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = Math.abs(endY - startY);

        // Horizontal swipe > 100px and minimal vertical movement
        if (diffX > 100 && diffY < 50) {
            // Trigger "Back" Action: Close Modals or Sidebar
            let handled = false;
            
            // 1. Close Modals
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            if (modals.length > 0) {
                modals.forEach(m => m.classList.add('hidden'));
                handled = true;
            }
            
            // 2. Close Library if expanded
            if (!handled && isLibraryExpanded && librarySection) {
                 // Actually librarySection is usually on the right. Swipe from left shouldn't close it?
                 // Or maybe "Back" means return to previous state?
                 // If library is open, maybe close it?
                 // But swipe from LEFT usually means "Go Back". 
                 // If library is overlay (on mobile), closing it makes sense.
                 // In this layout, library is a column.
                 // Let's just handle modals for now.
            }
            
            if (handled) {
                showToast("已关闭弹窗");
            }
        }
        
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}, { passive: true });

// Start
init();
// Check layout after init
setTimeout(checkLibraryMode, 100);

// --- Mobile Drag & Drop Implementation ---
function addMobileDragHandler(triggerEl, cardData, targetCardEl) {
    let touchTimer = null;
    let startX, startY;
    
    // If targetCardEl not provided, assume triggerEl is the card (legacy fallback)
    const cardEl = targetCardEl || triggerEl;
    
    triggerEl.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        
        // Stop propagation to prevent card's context menu long press
        e.stopPropagation();
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // Visual Feedback for potential drag on the CARD
        cardEl.style.transition = 'transform 0.2s';
        cardEl.style.transform = 'scale(0.95)';
        
        touchTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(50);
            startMobileDrag(e.touches[0], cardData, cardEl);
            touchTimer = null;
        }, 300); // 300ms long press threshold
    }, { passive: false });
    
    triggerEl.addEventListener('touchmove', (e) => {
        if (touchTimer) {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            // Cancel if moved too much before long press triggers
            if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
                clearTimeout(touchTimer);
                touchTimer = null;
                cardEl.style.transform = ''; // Reset
            }
        }
    }, { passive: true });
    
    triggerEl.addEventListener('touchend', () => {
        if (touchTimer) {
            clearTimeout(touchTimer);
            cardEl.style.transform = ''; // Reset
        }
    });
}

// Auto-scroll Logic
let autoScrollInterval = null;

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

function handleMobileAutoScroll(clientY) {
    const scrollThreshold = 80; // px from edge
    const scrollSpeed = 15;
    const viewportHeight = window.innerHeight;
    const drawerThreshold = window.innerHeight * 0.4;
    
    // Only scroll if we are in the drawer area (Reordering)
    if (clientY > drawerThreshold) {
        const scrollContainer = document.getElementById('deck-list');
        if (!scrollContainer) return;

        // Check if we need to scroll
        let shouldScroll = false;
        let direction = 0; // -1 up, 1 down

        // Top of drawer area (relative to viewport)
        // The drawer starts at drawerThreshold.
        if (clientY < drawerThreshold + scrollThreshold) {
            direction = -1;
            shouldScroll = true;
        } 
        // Bottom of viewport
        else if (clientY > viewportHeight - scrollThreshold) {
            direction = 1;
            shouldScroll = true;
        }

        if (shouldScroll) {
            if (!autoScrollInterval) {
                autoScrollInterval = setInterval(() => {
                    scrollContainer.scrollTop += (direction * scrollSpeed);
                }, 16);
            }
        } else {
            stopAutoScroll();
        }
    } else {
        stopAutoScroll();
    }
}

function startMobileDrag(touch, cardData, originalEl) {
    // 1. Visuals on original
    originalEl.style.transform = ''; // Reset scale from press effect
    originalEl.style.opacity = '0.2'; // Dim original to indicate movement
    
    // 2. Create Clone for Dragging
    const clone = originalEl.cloneNode(true);
    clone.classList.add('dragging-clone');
    clone.style.width = '160px'; // Force standard width
    clone.style.height = '224px';
    
    // Center the clone under finger
    clone.style.left = (touch.clientX - 80) + 'px'; 
    clone.style.top = (touch.clientY - 112) + 'px';
    
    // Remove interactive elements from clone
    const closeBtn = clone.querySelector('.card-close-btn');
    if (closeBtn) closeBtn.remove();
    const dragHandle = clone.querySelector('.drag-handle');
    if (dragHandle) dragHandle.remove();
    
    document.body.appendChild(clone);
    document.body.classList.add('dragging-active');
    
    // 3. Setup Context
    const deckContentColumn = document.getElementById('deck-content-column');
    const backdrop = document.querySelector('.drawer-backdrop');
    const deckList = document.getElementById('deck-list');
    const room = getCurrentRoom();
    
    // Threshold for switching between Reorder (Drawer) and Assign (Char List)
    // Drawer height is 60vh, so top is at 40% of viewport height
    const drawerThreshold = window.innerHeight * 0.4;
    
    let lastSwapTime = 0;
    let isDrawerHidden = false;

    // 4. Global Move Listener
    const moveHandler = (e) => {
        e.preventDefault(); // Prevent scrolling
        const t = e.touches[0];
        
        // Auto-scroll
        handleMobileAutoScroll(t.clientY);

        // Update Clone Position
        clone.style.left = (t.clientX - 80) + 'px';
        clone.style.top = (t.clientY - 112) + 'px';
        
        // Logic Branch: Inside vs Outside Drawer
        if (t.clientY < drawerThreshold) {
            // --- OUTSIDE DRAWER (Assign Mode) ---
            if (!isDrawerHidden) {
                if (deckContentColumn) deckContentColumn.classList.remove('active');
                if (backdrop) backdrop.classList.remove('active');
                isDrawerHidden = true;
            }
            
            // Highlight Character Targets
            const target = document.elementFromPoint(t.clientX, t.clientY);
            const charCard = target ? target.closest('.character-card-container') : null;
            
            document.querySelectorAll('.character-card-container').forEach(c => c.classList.remove('drag-target-active'));
            if (charCard) {
                charCard.classList.add('drag-target-active');
            }
            
        } else {
            // --- INSIDE DRAWER (Reorder Mode) ---
            if (isDrawerHidden) {
                if (deckContentColumn) deckContentColumn.classList.add('active');
                if (backdrop) backdrop.classList.add('active');
                isDrawerHidden = false;
            }
            
            // Clear Char Highlights
            document.querySelectorAll('.character-card-container').forEach(c => c.classList.remove('drag-target-active'));
            
            // Reorder Logic
            const target = document.elementFromPoint(t.clientX, t.clientY);
            const targetCard = target ? target.closest('.card') : null;
            
            // Check if we are hovering over a different card in the deck list
            if (targetCard && targetCard !== originalEl && deckList.contains(targetCard)) {
                const now = Date.now();
                if (now - lastSwapTime > 100) { // Throttle swaps (100ms)
                    performMobileSwap(originalEl, targetCard, room);
                    lastSwapTime = now;
                }
            }
        }
    };
    
    // 5. End Listener
    const endHandler = (e) => {
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', endHandler);
        stopAutoScroll();
        
        const t = e.changedTouches[0];
        let success = false;
        
        // Check drop target
        if (t.clientY < drawerThreshold) {
            // Dropped in Assign Area
            const target = document.elementFromPoint(t.clientX, t.clientY);
            const charCard = target ? target.closest('.character-card-container') : null;
            
            if (charCard && charCard.dataset.charId) {
                // Assign to Character
                moveCardFromDeckToChar(cardData.uniqueId.toString(), charCard.dataset.charId);
                showToast(`已装备狂气给 ${charCard.querySelector('.char-name').textContent}`);
                success = true;
                // Drawer stays hidden naturally or we can reset state if needed
                // But usually we want to see the result on the character
            }
        } else {
            // Dropped in Drawer (Reorder confirmed)
            // Save the new order
            saveData();
            // Refresh visuals to ensure indices/state are clean
            updateDeckVisuals(room);
            success = true; // Considered success as reorder
        }
        
        // Cleanup
        clone.remove();
        document.body.classList.remove('dragging-active');
        document.querySelectorAll('.character-card-container').forEach(c => c.classList.remove('drag-target-active'));
        
        if (!success) {
            // If failed (e.g. dropped in void), restore drawer
            if (deckContentColumn) deckContentColumn.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            updateDeckVisuals(room); // Restore original
        } else {
            // Even on success, if we were reordering, we want drawer open.
            // If we assigned, we might want drawer closed?
            // Existing logic: moveCardFromDeckToChar -> updateDeckVisuals -> which doesn't auto-open drawer
            // But if we assigned, isDrawerHidden was true.
            // If we reordered, isDrawerHidden was false.
            if (!isDrawerHidden) {
                if (deckContentColumn) deckContentColumn.classList.add('active');
                if (backdrop) backdrop.classList.add('active');
            }
        }
    };
    
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', endHandler);
}

function performMobileSwap(cardA, cardB, room) {
    const parent = cardA.parentNode;
    const siblings = [...parent.children];
    const idxA = siblings.indexOf(cardA);
    const idxB = siblings.indexOf(cardB);
    
    // DOM Swap
    if (idxA < idxB) {
        parent.insertBefore(cardA, cardB.nextSibling);
    } else {
        parent.insertBefore(cardA, cardB);
    }
    
    // Data Swap (Array is reversed relative to DOM)
    const dataIdxA = room.deck.length - 1 - idxA;
    // Note: After DOM swap, the indices change, but we need the indices BEFORE the swap for logic?
    // Actually, we need to swap the elements in the data array corresponding to the positions.
    // Let's use the indices we found.
    const dataIdxB = room.deck.length - 1 - idxB;
    
    // We just swap the elements at these positions
    if (dataIdxA >= 0 && dataIdxB >= 0 && dataIdxA < room.deck.length && dataIdxB < room.deck.length) {
         const temp = room.deck[dataIdxA];
         room.deck[dataIdxA] = room.deck[dataIdxB];
         room.deck[dataIdxB] = temp;
    }
}
