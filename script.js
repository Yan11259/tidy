
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
const categoryFilterDesktop = document.getElementById('category-filter');
const categoryFilterMobile = document.getElementById('category-filter-mobile');
const librarySearchInput = document.getElementById('library-search-input');
const createCustomMadnessBtn = document.getElementById('create-custom-madness-btn');
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

const characterInfoModal = document.getElementById('character-info-modal');
const characterInfoTitle = document.getElementById('character-info-title');
const characterInfoCloseBtn = document.getElementById('character-info-close-btn');
const charNameInput = document.getElementById('char-name-input');
const charCardColorInput = document.getElementById('char-card-color');
const charSanityCurrentInput = document.getElementById('char-sanity-current');
const charSanityMaxInput = document.getElementById('char-sanity-max');
const charHpCurrentInput = document.getElementById('char-hp-current');
const charHpMaxInput = document.getElementById('char-hp-max');
const charSanityCurrentDecBtn = document.getElementById('char-sanity-current-dec');
const charSanityCurrentIncBtn = document.getElementById('char-sanity-current-inc');
const charSanityMaxDecBtn = document.getElementById('char-sanity-max-dec');
const charSanityMaxIncBtn = document.getElementById('char-sanity-max-inc');
const charHpCurrentDecBtn = document.getElementById('char-hp-current-dec');
const charHpCurrentIncBtn = document.getElementById('char-hp-current-inc');
const charHpMaxDecBtn = document.getElementById('char-hp-max-dec');
const charHpMaxIncBtn = document.getElementById('char-hp-max-inc');
const charItemGrid = document.getElementById('char-item-grid');
const charNotesInput = document.getElementById('char-notes-input');
const charNotesCount = document.getElementById('char-notes-count');
let characterInfoCharId = null;

const customEditorModal = document.getElementById('custom-madness-editor-modal');
const customEditorCloseBtn = document.getElementById('custom-editor-close-btn');
const customGroupInput = document.getElementById('custom-group');
const customNameInput = document.getElementById('custom-name');
const customTriggerInput = document.getElementById('custom-trigger');
const customEffectInput = document.getElementById('custom-effect');
const customRemarksInput = document.getElementById('custom-remarks');
const customSaveBtn = document.getElementById('custom-save-btn');
const customEditorError = document.getElementById('custom-editor-error');
const customPreviewContainer = document.getElementById('custom-preview-container');

const exportCodeModal = document.getElementById('export-code-modal');
const exportCloseBtn = document.getElementById('export-close-btn');
const exportCodeText = document.getElementById('export-code-text');
const exportCopyBtn = document.getElementById('export-copy-btn');
const generateExportCodeBtn = document.getElementById('generate-export-code-btn');
const mobileGenerateExportCodeBtn = document.getElementById('mobile-generate-export-code-btn');


// Constants
const CHARACTER_COLORS = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', 
    '#3498db', '#9b59b6', '#34495e', '#7f8c8d'
];

function randomHexColor() {
    return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')}`;
}

function pickUniqueRandomColor(usedColors, maxTries = 40) {
    const used = usedColors instanceof Set ? usedColors : new Set();
    for (let i = 0; i < maxTries; i++) {
        const c = randomHexColor().toLowerCase();
        if (!used.has(c)) return c;
    }
    return randomHexColor().toLowerCase();
}

function hexToRgba(hex, alpha) {
    const a = Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1;
    if (typeof hex !== 'string') return `rgba(59, 130, 246, ${a})`;
    const raw = hex.trim().replace('#', '');
    if (raw.length === 3) {
        const r = parseInt(raw[0] + raw[0], 16);
        const g = parseInt(raw[1] + raw[1], 16);
        const b = parseInt(raw[2] + raw[2], 16);
        if ([r, g, b].some(n => Number.isNaN(n))) return `rgba(59, 130, 246, ${a})`;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    if (raw.length === 6) {
        const r = parseInt(raw.slice(0, 2), 16);
        const g = parseInt(raw.slice(2, 4), 16);
        const b = parseInt(raw.slice(4, 6), 16);
        if ([r, g, b].some(n => Number.isNaN(n))) return `rgba(59, 130, 246, ${a})`;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `rgba(59, 130, 246, ${a})`;
}

function hexToRgb(hex) {
    if (typeof hex !== 'string') return null;
    const raw = hex.trim().replace('#', '');
    if (raw.length === 3) {
        const r = parseInt(raw[0] + raw[0], 16);
        const g = parseInt(raw[1] + raw[1], 16);
        const b = parseInt(raw[2] + raw[2], 16);
        if ([r, g, b].some(n => Number.isNaN(n))) return null;
        return { r, g, b };
    }
    if (raw.length === 6) {
        const r = parseInt(raw.slice(0, 2), 16);
        const g = parseInt(raw.slice(2, 4), 16);
        const b = parseInt(raw.slice(4, 6), 16);
        if ([r, g, b].some(n => Number.isNaN(n))) return null;
        return { r, g, b };
    }
    return null;
}

function rgbToHsl(r, g, b) {
    const rr = Math.max(0, Math.min(255, r)) / 255;
    const gg = Math.max(0, Math.min(255, g)) / 255;
    const bb = Math.max(0, Math.min(255, b)) / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === rr) h = ((gg - bb) / d) % 6;
        else if (max === gg) h = (bb - rr) / d + 2;
        else h = (rr - gg) / d + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }
    const l = (max + min) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function setCharColorVars(el, hex) {
    if (!el || typeof hex !== 'string') return;
    const color = hex.trim();
    el.style.setProperty('--char-color', color);
    el.style.setProperty('--char-color-strong', hexToRgba(color, 0.72));
    el.style.setProperty('--char-color-mid', hexToRgba(color, 0.48));
    el.style.setProperty('--fade-color', hexToRgba(color, 0.42));
    el.style.setProperty('--halo-dur', `${(10 + Math.random() * 10).toFixed(2)}s`);
    el.style.setProperty('--halo-delay', `${(-Math.random() * 12).toFixed(2)}s`);

    const rgb = hexToRgb(color);
    if (!rgb) return;
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let accentHue = (h + 45) % 360;
    if (h >= 250 && h <= 315) accentHue = (h + 300) % 360;
    else if (h >= 30 && h <= 90) accentHue = (h + 80) % 360;
    else if (h >= 0 && h <= 25) accentHue = (h + 55) % 360;

    const accentS = Math.max(60, Math.min(96, s));
    const accentL = Math.max(52, Math.min(72, l + 12));
    el.style.setProperty('--char-accent-strong', `hsla(${accentHue} ${accentS}% ${accentL}% / 0.62)`);
    el.style.setProperty('--char-accent-mid', `hsla(${accentHue} ${accentS}% ${Math.max(40, accentL - 14)}% / 0.30)`);
}

function formatCharStatsText(char) {
    const sanityCur = Number.isFinite(char.sanityCurrent) ? char.sanityCurrent : 6;
    const sanityMax = Number.isFinite(char.sanityMax) ? char.sanityMax : 6;
    const hpCur = Number.isFinite(char.hpCurrent) ? char.hpCurrent : 6;
    const hpMax = Number.isFinite(char.hpMax) ? char.hpMax : 6;
    return `生命${hpCur}/${hpMax} 正气${sanityCur}/${sanityMax}`;
}

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
        if (!librarySection.classList.contains('hidden')) {
            librarySection.classList.remove('collapsed');
            requestAnimationFrame(() => {
                if (librarySection.offsetWidth < 120) librarySection.style.flex = '0 0 300px';
                setLibraryMode(isLibraryExpanded);
                autoLibraryModeByWidth();
            });
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

    // Migration: Assign drawnOrder to existing cards
    rooms.forEach(room => {
        if (room.characters) {
            room.characters.forEach(char => {
                if (char.cards) {
                    char.cards.forEach((c, i) => {
                        if (!c.drawnOrder) c.drawnOrder = i + 1;
                        
                        // Fix for existing revealed cards missing timestamp
                        if (c.isRevealed && !c.revealedAt) {
                            // Assign a mock timestamp based on existing revealOrder or drawnOrder
                            // to maintain relative order as best as possible.
                            // Assuming revealOrder was set previously, use it.
                            const baseTime = Date.now() - 100000;
                            c.revealedAt = baseTime + (c.revealOrder || i) * 1000;
                        }
                    });
                }
            });
        }
    });

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

    initDocking();
    initEdgeResize();
    window.addEventListener('resize', autoLibraryModeByWidth, { passive: true });
    
    // Dark Mode Logic
    const toggleDarkModeBtn = document.getElementById('dark-mode-toggle-pc');
    const toggleDarkModeBtnMobile = document.getElementById('dark-mode-toggle-mobile');
    
    // Icons
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    function updateDarkModeIcons(isDark) {
        const icon = isDark ? sunIcon : moonIcon;
        const title = isDark ? "切换日间模式" : "切换黑夜模式";
        
        if(toggleDarkModeBtn) {
            toggleDarkModeBtn.innerHTML = icon;
            toggleDarkModeBtn.title = title;
        }
        if(toggleDarkModeBtnMobile) {
            toggleDarkModeBtnMobile.innerHTML = icon;
            toggleDarkModeBtnMobile.title = title;
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('insane_dark_mode', isDark);
        updateDarkModeIcons(isDark);
    }
    
    // Init state
    const savedDarkMode = localStorage.getItem('insane_dark_mode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcons(savedDarkMode);
    
    if (toggleDarkModeBtn) toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
    if (toggleDarkModeBtnMobile) toggleDarkModeBtnMobile.addEventListener('click', toggleDarkMode);
    
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
                
                autoLibraryModeByWidth();
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
    const createRoomModalImportCode = document.getElementById('create-room-modal-import-code');
    const createRoomImportProgressFill = document.getElementById('create-room-import-progress-fill');
    const createRoomImportStatusText = document.getElementById('create-room-import-status-text');
    const createRoomModalImportConfirm = document.getElementById('create-room-modal-import-confirm');
    const createRoomModalCloseBtn = document.getElementById('create-room-modal-close');

    function openCreateRoomModal() {
        if (!createRoomModal) return;
        createRoomModal.classList.remove('hidden');
        if (createRoomModalInput) createRoomModalInput.focus();
        if (createRoomModalImportCode) createRoomModalImportCode.value = '';
        if (createRoomImportProgressFill) createRoomImportProgressFill.style.width = '0%';
        if (createRoomImportStatusText) createRoomImportStatusText.textContent = '';
    }

    function closeCreateRoomModal() {
        if (!createRoomModal) return;
        createRoomModal.classList.add('hidden');
    }

    window.openCreateRoomModal = openCreateRoomModal;

    if (mobileCreateBtn) {
        mobileCreateBtn.addEventListener('click', () => {
             openCreateRoomModal();
        });
    }

    if (createRoomModalCancel) {
        createRoomModalCancel.addEventListener('click', () => {
            closeCreateRoomModal();
        });
    }

    if (createRoomModalCloseBtn) {
        createRoomModalCloseBtn.addEventListener('click', () => {
            closeCreateRoomModal();
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
                closeCreateRoomModal();
                showToast("房间已创建");
            } else {
                showToast("请输入房间名");
            }
        });
    }
    if (createRoomModalImportConfirm) {
        createRoomModalImportConfirm.addEventListener('click', async () => {
            const code = createRoomModalImportCode ? createRoomModalImportCode.value.trim() : '';
            const ok = await importRoomFromCode(code, createRoomImportProgressFill, createRoomImportStatusText);
            if (ok) closeCreateRoomModal();
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

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (customEditorModal && !customEditorModal.classList.contains('hidden')) return closeCustomEditorModal();
        const createRoomModal = document.getElementById('create-room-modal');
        if (createRoomModal && !createRoomModal.classList.contains('hidden')) return createRoomModal.classList.add('hidden');
        if (exportCodeModal && !exportCodeModal.classList.contains('hidden')) return closeExportCodeModal();
        if (characterInfoModal && !characterInfoModal.classList.contains('hidden')) return closeCharacterInfoModal();
        if (cardPreviewModal && !cardPreviewModal.classList.contains('hidden')) return cardPreviewModal.classList.add('hidden');
    });
}

function getCustomMadnessCards() {
    try {
        const raw = localStorage.getItem('insane_custom_madness_cards');
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    } catch (e) {
        return [];
    }
}

function saveCustomMadnessCards(cards) {
    localStorage.setItem('insane_custom_madness_cards', JSON.stringify(cards || []));
}

function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Helper to get current data source
function getCurrentData() {
    const ALWAYS_CATEGORIES = new Set(['BlackDays', 'Blackdays', '刀之时代', '华之时代']);
    const mergeExtras = (baseGroups, extraGroups) => {
        const merged = baseGroups.map(group => ({
            category: group.category,
            cards: Array.isArray(group.cards) ? [...group.cards] : []
        }));
        const keys = new Set();
        merged.forEach(g => {
            (g.cards || []).forEach(c => {
                const k = `${g.category}|${c && c.name ? c.name : ''}|${c && c.nameEn ? c.nameEn : ''}|${c && c.trigger ? c.trigger : ''}|${c && c.effect ? c.effect : ''}`;
                keys.add(k);
            });
        });
        extraGroups.forEach(group => {
            const cat = group && group.category ? String(group.category) : '';
            if (!ALWAYS_CATEGORIES.has(cat)) return;
            let target = merged.find(g => g.category === cat);
            if (!target) {
                target = { category: cat, cards: [] };
                merged.push(target);
            }
            (group.cards || []).forEach(c => {
                const k = `${cat}|${c && c.name ? c.name : ''}|${c && c.nameEn ? c.nameEn : ''}|${c && c.trigger ? c.trigger : ''}|${c && c.effect ? c.effect : ''}`;
                if (keys.has(k)) return;
                keys.add(k);
                target.cards.push(c);
            });
        });
        return merged;
    };

    const baseRaw = isBigFormat ? cardsData : oldCardsData;
    const base = isBigFormat ? mergeExtras(baseRaw, oldCardsData) : mergeExtras(baseRaw, cardsData);
    const custom = getCustomMadnessCards();
    if (!custom.length) return base;
    const merged = base.map(group => ({
        category: group.category,
        cards: Array.isArray(group.cards) ? [...group.cards] : []
    }));
    custom.forEach(card => {
        const cat = (card && card.category) ? String(card.category) : '用户原创狂气';
        let group = merged.find(g => g.category === cat);
        if (!group) {
            group = { category: cat, cards: [] };
            merged.push(group);
        }
        group.cards.push(card);
    });
    return merged;
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
    const getSelectedCategory = () => {
        if (categoryFilterDesktop) return categoryFilterDesktop.value;
        if (categoryFilterMobile) return categoryFilterMobile.value;
        return 'all';
    };
    const setSelectedCategory = (v) => {
        if (categoryFilterDesktop) categoryFilterDesktop.value = v;
        if (categoryFilterMobile) categoryFilterMobile.value = v;
    };

    const prev = getSelectedCategory();
    if (categoryFilterDesktop) categoryFilterDesktop.innerHTML = '<option value="all">全部狂气</option>';
    if (categoryFilterMobile) categoryFilterMobile.innerHTML = '<option value="all">全部狂气</option>';
    const data = getCurrentData();
    const categories = [...new Set(data.map(c => c.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (categoryFilterDesktop) categoryFilterDesktop.appendChild(option.cloneNode(true));
        if (categoryFilterMobile) categoryFilterMobile.appendChild(option.cloneNode(true));
    });

    const allowed = categories.includes(prev);
    setSelectedCategory(allowed ? prev : 'all');
}

function getSelectedCategory() {
    if (categoryFilterDesktop) return categoryFilterDesktop.value;
    if (categoryFilterMobile) return categoryFilterMobile.value;
    return 'all';
}

function setSelectedCategory(v) {
    if (categoryFilterDesktop) categoryFilterDesktop.value = v;
    if (categoryFilterMobile) categoryFilterMobile.value = v;
}

if (categoryFilterDesktop) {
    categoryFilterDesktop.addEventListener('change', () => {
        setSelectedCategory(categoryFilterDesktop.value);
        renderMadnessCards();
    });
}
if (categoryFilterMobile) {
    categoryFilterMobile.addEventListener('change', () => {
        setSelectedCategory(categoryFilterMobile.value);
        renderMadnessCards();
    });
}

librarySearchInput.addEventListener('input', () => {
    renderMadnessCards();
});

// Library View Toggle
if (toggleLibraryViewBtn) {
    toggleLibraryViewBtn.addEventListener('click', () => {
        setLibraryMode(!isLibraryExpanded);
    });
}

const DOCK_STORAGE_KEY = 'dock_order_v1';

function applyDockOrder() {
    const layout = document.querySelector('.game-layout');
    if (!layout) return;
    let order = null;
    try {
        order = JSON.parse(localStorage.getItem(DOCK_STORAGE_KEY) || 'null');
    } catch {}
    if (!Array.isArray(order) || order.length === 0) return;
    order.forEach(id => {
        const el = document.getElementById(id);
        if (el) layout.appendChild(el);
    });
}

function saveDockOrder() {
    const layout = document.querySelector('.game-layout');
    if (!layout) return;
    const ids = Array.from(layout.children)
        .filter(el => el && el.classList && el.classList.contains('resizable-panel'))
        .map(el => el.id)
        .filter(Boolean);
    localStorage.setItem(DOCK_STORAGE_KEY, JSON.stringify(ids));
}

function initDocking() {
    applyDockOrder();
    const layout = document.querySelector('.game-layout');
    if (!layout) return;

    let draggedPanelId = null;
    const handles = document.querySelectorAll('.dock-handle-btn[data-dock-panel]');
    const panels = document.querySelectorAll('.resizable-panel');

    const clearTargets = () => {
        panels.forEach(p => {
            p.classList.remove('dock-drop-target');
            if (p.dataset) delete p.dataset.dropPos;
        });
        document.body.classList.remove('docking');
    };

    handles.forEach(btn => {
        btn.addEventListener('dragstart', (e) => {
            draggedPanelId = btn.dataset.dockPanel || null;
            if (!draggedPanelId) return;
            e.dataTransfer.setData('text/plain', draggedPanelId);
            e.dataTransfer.effectAllowed = 'move';
            document.body.classList.add('docking');
        });

        btn.addEventListener('dragend', () => {
            draggedPanelId = null;
            clearTargets();
        });
    });

    panels.forEach(panel => {
        panel.addEventListener('dragover', (e) => {
            if (!draggedPanelId) return;
            e.preventDefault();
            panel.classList.add('dock-drop-target');
            const rect = panel.getBoundingClientRect();
            const before = e.clientX < rect.left + rect.width / 2;
            panel.dataset.dropPos = before ? 'before' : 'after';
            e.dataTransfer.dropEffect = 'move';
        });

        panel.addEventListener('dragleave', () => {
            panel.classList.remove('dock-drop-target');
            if (panel.dataset) delete panel.dataset.dropPos;
        });

        panel.addEventListener('drop', (e) => {
            if (!draggedPanelId) return;
            e.preventDefault();
            const fromId = e.dataTransfer.getData('text/plain') || draggedPanelId;
            const fromEl = document.getElementById(fromId);
            if (!fromEl || fromEl === panel) return;

            const rect = panel.getBoundingClientRect();
            const before = e.clientX < rect.left + rect.width / 2;
            layout.insertBefore(fromEl, before ? panel : panel.nextSibling);
            saveDockOrder();
            draggedPanelId = null;
            clearTargets();
        });
    });
}

function initEdgeResize() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const layout = document.querySelector('.game-layout');
    if (!layout) return;

    const constraints = {
        'character-column': { min: 200, max: 520 },
        'deck-3d-column': { min: 240, max: 560 },
        'library-section': { min: 160, max: 900 }
    };

    const edgeSize = 6;
    let hover = null;
    let resizing = null;
    let libraryAutoRaf = 0;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const getRule = (panel) => constraints[panel.id] || { min: 220, max: 9999 };
    const isVisiblePanel = (el) => !!(el && el.classList && el.classList.contains('resizable-panel') && !el.classList.contains('hidden'));
    const getMinWidth = (el) => {
        if (!el || !el.id) return 200;
        if (el.id === 'deck-content-column') return 260;
        const rule = constraints[el.id];
        return rule ? rule.min : 200;
    };
    const calcMaxFor = (target) => {
        const rect = layout.getBoundingClientRect();
        const others = Array.from(layout.children).filter(el => isVisiblePanel(el) && el !== target);
        const minOthers = others.reduce((sum, el) => sum + getMinWidth(el), 0);
        return Math.max(getRule(target).min, Math.floor(rect.width - minOthers));
    };

    const setCursor = (on) => {
        layout.style.cursor = on ? 'col-resize' : '';
        if (!on && document.body.style.cursor === 'col-resize') document.body.style.cursor = '';
    };

    const findPanelAt = (target) => {
        if (!target) return null;
        const el = target.closest && target.closest('.resizable-panel');
        if (!el || !layout.contains(el)) return null;
        return el;
    };

    layout.addEventListener('mousemove', (e) => {
        if (resizing) return;
        const panel = findPanelAt(e.target);
        if (!panel) {
            hover = null;
            setCursor(false);
            return;
        }
        const rect = panel.getBoundingClientRect();
        const nearLeft = Math.abs(e.clientX - rect.left) <= edgeSize;
        const nearRight = Math.abs(e.clientX - rect.right) <= edgeSize;
        const canLeft = nearLeft && panel.previousElementSibling && panel.previousElementSibling.classList && panel.previousElementSibling.classList.contains('resizable-panel');
        const canRight = nearRight && panel.nextElementSibling && panel.nextElementSibling.classList && panel.nextElementSibling.classList.contains('resizable-panel');
        if (canLeft) {
            hover = { panel, side: 'left' };
            setCursor(true);
            return;
        }
        if (canRight) {
            hover = { panel, side: 'right' };
            setCursor(true);
            return;
        }
        hover = null;
        setCursor(false);
    });

    layout.addEventListener('mouseleave', () => {
        if (resizing) return;
        hover = null;
        setCursor(false);
    });

    layout.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (!hover) return;
        const leftPanel = hover.side === 'right' ? hover.panel : hover.panel.previousElementSibling;
        const rightPanel = hover.side === 'right' ? hover.panel.nextElementSibling : hover.panel;
        if (!isVisiblePanel(leftPanel) || !isVisiblePanel(rightPanel)) return;

        const activePanel = (rightPanel && rightPanel.id === 'library-section') ? rightPanel : leftPanel;
        if (!activePanel || !activePanel.id || activePanel.id === 'deck-content-column') return;

        const rule = { ...getRule(activePanel), max: calcMaxFor(activePanel) };
        resizing = {
            panel: activePanel,
            startX: e.clientX,
            startW: activePanel.getBoundingClientRect().width,
            rule,
            sign: (activePanel === rightPanel && hover.side === 'left') ? -1 : 1
        };
        const deckContent = document.getElementById('deck-content-column');
        if (deckContent && deckContent.style && deckContent.style.flex && deckContent.style.flex.startsWith('0 0')) {
            deckContent.style.flex = '1 1 0%';
        }
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const dx = (e.clientX - resizing.startX) * (resizing.sign || 1);
        const maxNow = calcMaxFor(resizing.panel);
        const nextW = clamp(resizing.startW + dx, resizing.rule.min, Math.min(resizing.rule.max, maxNow));
        resizing.panel.style.flex = `0 0 ${Math.round(nextW)}px`;
        if (resizing.panel && resizing.panel.id === 'library-section') {
            if (libraryAutoRaf) cancelAnimationFrame(libraryAutoRaf);
            libraryAutoRaf = requestAnimationFrame(() => {
                libraryAutoRaf = 0;
                autoLibraryModeByWidth();
            });
        }
    });

    document.addEventListener('mouseup', () => {
        if (!resizing) return;
        resizing = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        autoLibraryModeByWidth();
    });
}


// Initialize library mode correctly
function setLibraryMode(expanded) {
    isLibraryExpanded = expanded;
    if (isLibraryExpanded) {
        librarySection.classList.remove('compact');
        madnessContainer.classList.remove('compact-view');
        madnessContainer.classList.add('expanded-view');
        if(libraryModeLabel) libraryModeLabel.textContent = '平铺模式';
    } else {
        librarySection.classList.add('compact');
        madnessContainer.classList.remove('expanded-view');
        madnessContainer.classList.add('compact-view');
        if(libraryModeLabel) libraryModeLabel.textContent = '堆叠模式';
    }
}

function getMadnessCardWidth() {
    try {
        const sample = madnessContainer ? madnessContainer.querySelector('.card') : null;
        if (sample) {
            const w = sample.getBoundingClientRect().width;
            if (Number.isFinite(w) && w > 0) return Math.max(160, w);
        }
    } catch (e) {}
    return 160;
}

function autoLibraryModeByWidth() {
    if (!librarySection || !madnessContainer) return;
    if (librarySection.classList.contains('hidden')) return;
    const rectW = madnessContainer.getBoundingClientRect().width;
    const cs = window.getComputedStyle ? getComputedStyle(madnessContainer) : null;
    const padL = cs ? parseFloat(cs.paddingLeft) || 0 : 0;
    const padR = cs ? parseFloat(cs.paddingRight) || 0 : 0;
    const w = Math.max(0, rectW - padL - padR);
    const cardW = getMadnessCardWidth();
    const gap = 10;
    const expandedThreshold = cardW * 2 + gap;
    const compactThreshold = cardW;
    if (w >= expandedThreshold) setLibraryMode(true);
    else if (w <= compactThreshold) setLibraryMode(false);
}

// Initial mode check (on load)
function checkLibraryMode() {
    autoLibraryModeByWidth();
}

// Render Madness Cards (Library)
function renderMadnessCards() {
    setLibraryMode(isLibraryExpanded);
    const filterCategory = getSelectedCategory();
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
    autoLibraryModeByWidth();
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

    if (card.isCustom) {
        const badge = document.createElement('div');
        badge.className = 'card-custom-badge';
        badge.textContent = '原创';
        el.appendChild(badge);
    }

    if (card.iconUrl) {
        const icon = document.createElement('img');
        icon.className = 'card-icon';
        icon.alt = '';
        icon.src = card.iconUrl;
        el.appendChild(icon);
    }

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
const deleteConfirmTitle = document.getElementById('delete-confirm-title');
const deleteConfirmMessage = document.getElementById('delete-confirm-message');
let activeConfirmCleanup = null;

function openConfirmDialog(opts) {
    const title = opts && opts.title ? String(opts.title) : '确认删除?';
    const message = opts && opts.message ? String(opts.message) : '删除后将无法恢复，确定要继续吗？';
    const confirmText = opts && opts.confirmText ? String(opts.confirmText) : '确认删除';

    return new Promise(resolve => {
        if (!deleteConfirmModal || !deleteConfirmBtnFinal || !deleteCancelBtn) {
            resolve(false);
            return;
        }

        if (activeConfirmCleanup) activeConfirmCleanup(false);

        if (deleteConfirmTitle) deleteConfirmTitle.textContent = title;
        if (deleteConfirmMessage) deleteConfirmMessage.textContent = message;
        deleteConfirmBtnFinal.textContent = confirmText;

        const cleanup = (result) => {
            if (!deleteConfirmModal.classList.contains('hidden')) {
                deleteConfirmModal.classList.add('hidden');
            }
            activeConfirmCleanup = null;
            resolve(!!result);
        };

        activeConfirmCleanup = cleanup;
        deleteConfirmModal.classList.remove('hidden');

        deleteCancelBtn.addEventListener('click', () => cleanup(false), { once: true });
        deleteConfirmBtnFinal.addEventListener('click', () => cleanup(true), { once: true });
        deleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === deleteConfirmModal) cleanup(false);
        }, { once: true });
    });
}

function openDeleteConfirmModal(charId) {
    openConfirmDialog({
        title: '确认删除角色？',
        message: '删除后将无法恢复，确定要继续吗？',
        confirmText: '确认删除'
    }).then(confirmed => {
        if (confirmed) deleteCharacter(charId);
    });
}

function closeCharacterInfoModal() {
    if (!characterInfoModal) return;
    characterInfoModal.classList.add('hidden');
    characterInfoCharId = null;
}

function stepNumberInput(input, delta) {
    if (!input) return;
    const cur = Number(input.value || 0);
    const base = Number.isFinite(cur) ? cur : 0;
    const next = Math.max(0, Math.trunc(base + delta));
    input.value = String(next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

function openCharacterInfoModal(charId) {
    if (!characterInfoModal) return;
    const room = getCurrentRoom();
    if (!room) return;
    const char = room.characters.find(c => c.id === charId);
    if (!char) return;
    characterInfoCharId = charId;

    if (characterInfoTitle) characterInfoTitle.textContent = `${char.name} · 角色信息`;

    if (charNameInput) charNameInput.value = char.name || '';
    if (charCardColorInput) charCardColorInput.value = (char.color && typeof char.color === 'string') ? char.color : '#3b82f6';

    const sanityCurrentDefault = Number.isFinite(char.sanityCurrent) ? char.sanityCurrent : 6;
    const sanityMaxDefault = Number.isFinite(char.sanityMax) ? char.sanityMax : 6;
    const hpCurrentDefault = Number.isFinite(char.hpCurrent) ? char.hpCurrent : 6;
    const hpMaxDefault = Number.isFinite(char.hpMax) ? char.hpMax : 6;

    if (charSanityCurrentInput) charSanityCurrentInput.value = String(sanityCurrentDefault);
    if (charSanityMaxInput) charSanityMaxInput.value = String(sanityMaxDefault);
    if (charHpCurrentInput) charHpCurrentInput.value = String(hpCurrentDefault);
    if (charHpMaxInput) charHpMaxInput.value = String(hpMaxDefault);

    if (charItemGrid) {
        const itemDefs = [
            { key: 'stimulant', name: '镇定剂', icon: '💉' },
            { key: 'amulet', name: '护身符', icon: '🧿' },
            { key: 'weapon', name: '武器', icon: '🗡️' }
        ];

        const legacy = char.items && typeof char.items === 'object' ? char.items : {};
        const counts = char.itemCounts && typeof char.itemCounts === 'object' ? char.itemCounts : {};
        const normalized = {};
        itemDefs.forEach(def => {
            const v = counts[def.key];
            if (Number.isFinite(v)) normalized[def.key] = Math.max(0, Math.trunc(v));
            else normalized[def.key] = legacy[def.key] ? 1 : 0;
        });
        char.itemCounts = normalized;

        charItemGrid.innerHTML = '';
        itemDefs.forEach(def => {
            const cell = document.createElement('div');
            cell.className = 'item-editor-cell';

            const name = document.createElement('div');
            name.className = 'item-editor-name';
            name.textContent = def.name;

            const top = document.createElement('div');
            top.className = 'item-editor-top';
            top.appendChild(name);

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.step = '1';
            input.className = 'nav-input item-count-input';
            input.value = String(normalized[def.key] || 0);
            input.dataset.itemKey = def.key;

            input.addEventListener('input', () => {
                if (!characterInfoCharId) return;
                const r = getCurrentRoom();
                if (!r) return;
                const c = r.characters.find(x => x.id === characterInfoCharId);
                if (!c) return;
                if (!c.itemCounts || typeof c.itemCounts !== 'object') c.itemCounts = {};
                const n = Math.max(0, Math.trunc(Number(input.value || 0)));
                c.itemCounts[def.key] = n;
                saveData();
            });

            const stepper = document.createElement('div');
            stepper.className = 'num-stepper';
            const dec = document.createElement('button');
            dec.type = 'button';
            dec.className = 'num-step-btn minus';
            dec.setAttribute('aria-label', '减少');
            dec.textContent = '−';
            const inc = document.createElement('button');
            inc.type = 'button';
            inc.className = 'num-step-btn plus';
            inc.setAttribute('aria-label', '增加');
            inc.textContent = '+';
            stepper.appendChild(dec);
            stepper.appendChild(input);
            stepper.appendChild(inc);

            cell.appendChild(top);
            cell.appendChild(stepper);
            charItemGrid.appendChild(cell);
        });
    }

    if (charNotesInput) {
        charNotesInput.value = char.notes || '';
        if (charNotesCount) charNotesCount.textContent = String(charNotesInput.value.length);
    }

    characterInfoModal.classList.remove('hidden');
}

if (characterInfoCloseBtn) {
    characterInfoCloseBtn.addEventListener('click', closeCharacterInfoModal);
}
if (characterInfoModal) {
    characterInfoModal.addEventListener('click', (e) => {
        if (e.target === characterInfoModal) closeCharacterInfoModal();
    });
}
if (charNotesInput) {
    charNotesInput.addEventListener('input', () => {
        if (charNotesCount) charNotesCount.textContent = String(charNotesInput.value.length);
        if (!characterInfoCharId) return;
        const room = getCurrentRoom();
        if (!room) return;
        const char = room.characters.find(c => c.id === characterInfoCharId);
        if (!char) return;
        char.notes = charNotesInput.value;
        saveData();
    });
}

if (charNameInput) {
    charNameInput.addEventListener('input', () => {
        if (!characterInfoCharId) return;
        const room = getCurrentRoom();
        if (!room) return;
        const char = room.characters.find(c => c.id === characterInfoCharId);
        if (!char) return;
        char.name = charNameInput.value.slice(0, 30);
        if (characterInfoTitle) characterInfoTitle.textContent = `${char.name} · 角色信息`;
        const card = document.querySelector(`.character-card-container[data-char-id="${characterInfoCharId}"] .char-name`);
        if (card) card.textContent = char.name;
        saveData();
        updateRoomDropdown();
    });
}

if (charCardColorInput) {
    charCardColorInput.addEventListener('input', () => {
        if (!characterInfoCharId) return;
        const room = getCurrentRoom();
        if (!room) return;
        const char = room.characters.find(c => c.id === characterInfoCharId);
        if (!char) return;
        char.color = charCardColorInput.value;
        const card = document.querySelector(`.character-card-container[data-char-id="${characterInfoCharId}"]`);
        if (card) setCharColorVars(card, char.color);
        saveData();
    });
}

[charSanityCurrentInput, charSanityMaxInput, charHpCurrentInput, charHpMaxInput].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
        if (!characterInfoCharId) return;
        const room = getCurrentRoom();
        if (!room) return;
        const char = room.characters.find(c => c.id === characterInfoCharId);
        if (!char) return;
        char.sanityCurrent = Math.max(0, Math.trunc(Number(charSanityCurrentInput ? charSanityCurrentInput.value : 0)));
        char.sanityMax = Math.max(0, Math.trunc(Number(charSanityMaxInput ? charSanityMaxInput.value : 0)));
        char.hpCurrent = Math.max(0, Math.trunc(Number(charHpCurrentInput ? charHpCurrentInput.value : 0)));
        char.hpMax = Math.max(0, Math.trunc(Number(charHpMaxInput ? charHpMaxInput.value : 0)));
        const statsEl = document.querySelector(`.character-card-container[data-char-id="${characterInfoCharId}"] .char-stats-inline`);
        if (statsEl) statsEl.textContent = formatCharStatsText(char);
        saveData();
    });
});

if (characterInfoModal) {
    characterInfoModal.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('.num-step-btn') : null;
        if (!btn) return;
        const id = btn.dataset ? btn.dataset.target : '';
        const input = id ? document.getElementById(id) : (btn.parentElement ? btn.parentElement.querySelector('input') : null);
        if (!input) return;
        const delta = btn.classList && btn.classList.contains('plus') ? 1 : -1;
        stepNumberInput(input, delta);
    });
}

 

function closeCustomEditorModal() {
    if (!customEditorModal) return;
    customEditorModal.classList.add('hidden');
}

function buildCustomDraft() {
    return {
        id: '',
        category: (customGroupInput ? customGroupInput.value.trim() : ''),
        name: (customNameInput ? customNameInput.value.trim() : ''),
        nameEn: '',
        trigger: (customTriggerInput ? customTriggerInput.value.trim() : ''),
        effect: (customEffectInput ? customEffectInput.value.trim() : ''),
        remarks: (customRemarksInput ? customRemarksInput.value.trim() : ''),
        isCustom: true
    };
}

function validateCustomDraft(draft) {
    if (!draft.category) return '狂气分组为必填（≤30字）';
    if (draft.category.length > 30) return '狂气分组不能超过30字';
    if (!draft.name) return '名称为必填（≤30字）';
    if (draft.name.length > 30) return '名称不能超过30字';
    if (draft.remarks.length > 500) return '备注不能超过500字';
    if (!draft.trigger) return '触发条件为必填';
    if (!draft.effect) return '触发效果为必填';
    return '';
}

function updateCustomEditor() {
    if (!customEditorModal) return;
    const draft = buildCustomDraft();
    const error = validateCustomDraft(draft);
    if (customEditorError) {
        if (error) {
            customEditorError.textContent = error;
            customEditorError.classList.remove('hidden');
        } else {
            customEditorError.textContent = '';
            customEditorError.classList.add('hidden');
        }
    }
    if (customSaveBtn) customSaveBtn.disabled = !!error;

    if (customPreviewContainer) {
        customPreviewContainer.innerHTML = '';
        const previewCard = createCardElement({
            ...draft,
            category: draft.category || '用户原创狂气'
        }, false);
        previewCard.style.pointerEvents = 'none';
        previewCard.removeAttribute('draggable');
        customPreviewContainer.appendChild(previewCard);
    }
}

function openCustomEditorModal() {
    if (!customEditorModal) return;
    if (customGroupInput) customGroupInput.value = '';
    if (customNameInput) customNameInput.value = '';
    if (customTriggerInput) customTriggerInput.value = '';
    if (customEffectInput) customEffectInput.value = '';
    if (customRemarksInput) customRemarksInput.value = '';
    if (customEditorError) {
        customEditorError.textContent = '';
        customEditorError.classList.add('hidden');
    }
    customEditorModal.classList.remove('hidden');
    updateCustomEditor();
}

if (createCustomMadnessBtn) {
    createCustomMadnessBtn.addEventListener('click', () => {
        openCustomEditorModal();
    });
}
if (customEditorCloseBtn) customEditorCloseBtn.addEventListener('click', closeCustomEditorModal);
if (customEditorModal) {
    customEditorModal.addEventListener('click', (e) => {
        if (e.target === customEditorModal) closeCustomEditorModal();
    });
}

 [customGroupInput, customNameInput, customTriggerInput, customEffectInput, customRemarksInput].forEach(el => {
    if (el) el.addEventListener('input', updateCustomEditor);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', updateCustomEditor);
});

if (customSaveBtn) {
    customSaveBtn.addEventListener('click', () => {
        const draft = buildCustomDraft();
        const error = validateCustomDraft(draft);
        if (error) {
            if (customEditorError) {
                customEditorError.textContent = error;
                customEditorError.classList.remove('hidden');
            }
            return;
        }
        const saved = {
            id: generateId(),
            category: draft.category,
            name: draft.name,
            nameEn: '',
            trigger: draft.trigger,
            effect: draft.effect,
            remarks: draft.remarks,
            isCustom: true
        };
        const list = getCustomMadnessCards();
        list.push(saved);
        saveCustomMadnessCards(list);
        renderCategoryFilter();
        renderMadnessCards();
        populateRandomDialogCategories();
        closeCustomEditorModal();
        showToast('原创狂气已保存');
    });
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecodeToBytes(b64url) {
    const padLen = (4 - (b64url.length % 4)) % 4;
    const b64 = (b64url + '='.repeat(padLen)).replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

async function encodeExportPayload(payload) {
    const json = JSON.stringify(payload);
    if (typeof CompressionStream !== 'undefined') {
        try {
            const stream = new Blob([json], { type: 'application/json' }).stream().pipeThrough(new CompressionStream('gzip'));
            const buf = await new Response(stream).arrayBuffer();
            return `G1.${base64UrlEncodeBytes(new Uint8Array(buf))}`;
        } catch (e) {}
    }
    const bytes = new TextEncoder().encode(json);
    return `J1.${base64UrlEncodeBytes(bytes)}`;
}

async function decodeExportPayload(code) {
    if (!code) throw new Error('empty');
    if (code.startsWith('G1.')) {
        if (typeof DecompressionStream === 'undefined') throw new Error('no_decompress');
        const bytes = base64UrlDecodeToBytes(code.slice(3));
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        const buf = await new Response(stream).arrayBuffer();
        const json = new TextDecoder().decode(new Uint8Array(buf));
        return JSON.parse(json);
    }
    if (code.startsWith('J1.')) {
        const bytes = base64UrlDecodeToBytes(code.slice(3));
        const json = new TextDecoder().decode(bytes);
        return JSON.parse(json);
    }
    if (code.trim().startsWith('{')) return JSON.parse(code);
    throw new Error('invalid');
}

function closeExportCodeModal() {
    if (!exportCodeModal) return;
    exportCodeModal.classList.add('hidden');
}

async function openExportCodeModal() {
    if (!exportCodeModal) return;
    const room = getCurrentRoom();
    if (!room) return;
    const payload = {
        version: 2,
        room,
        isBigFormat,
        customMadnessCards: getCustomMadnessCards()
    };
    const code = await encodeExportPayload(payload);
    if (exportCodeText) {
        if ('value' in exportCodeText) exportCodeText.value = code;
        else exportCodeText.textContent = code;
    }
    exportCodeModal.classList.remove('hidden');
}

async function importRoomFromCode(code, progressFillEl, statusEl) {
    if (!code) {
        if (statusEl) statusEl.textContent = '请输入房间码';
        if (progressFillEl) progressFillEl.style.width = '0%';
        return false;
    }
    if (statusEl) statusEl.textContent = '解析房间码...';
    if (progressFillEl) progressFillEl.style.width = '15%';

    let payload;
    try {
        payload = await decodeExportPayload(code);
    } catch (e) {
        if (statusEl) statusEl.textContent = '房间码无效或不受支持';
        if (progressFillEl) progressFillEl.style.width = '0%';
        return false;
    }

    if (statusEl) statusEl.textContent = '重建房间...';
    if (progressFillEl) progressFillEl.style.width = '55%';

    try {
        const importedRoom = payload.room;
        const newRoom = {
            id: Date.now().toString(),
            name: importedRoom && importedRoom.name ? importedRoom.name : '导入房间',
            deck: Array.isArray(importedRoom.deck) ? importedRoom.deck : [],
            characters: Array.isArray(importedRoom.characters) ? importedRoom.characters : []
        };
        rooms.push(newRoom);

        if (typeof payload.isBigFormat !== 'undefined') {
            isBigFormat = !!payload.isBigFormat;
            localStorage.setItem('insane_big_format', isBigFormat);
            if (bigFormatToggle) bigFormatToggle.checked = isBigFormat;
            const mobileBigFormatCheckbox = document.getElementById('big-format-toggle-mobile');
            if (mobileBigFormatCheckbox) mobileBigFormatCheckbox.checked = isBigFormat;
        }

        const incomingCustom = Array.isArray(payload.customMadnessCards) ? payload.customMadnessCards : [];
        if (incomingCustom.length) {
            const existing = getCustomMadnessCards();
            const seen = new Set(existing.map(c => c.id));
            incomingCustom.forEach(c => {
                if (c && c.id && !seen.has(c.id)) {
                    existing.push(c);
                    seen.add(c.id);
                }
            });
            saveCustomMadnessCards(existing);
        }

        saveData();
        updateRoomDropdown();
        selectRoom(newRoom.id);
        renderCategoryFilter();
        renderMadnessCards();
        populateRandomDialogCategories();
    } catch (e) {
        if (statusEl) statusEl.textContent = '导入失败，请重试';
        if (progressFillEl) progressFillEl.style.width = '0%';
        return false;
    }

    if (statusEl) statusEl.textContent = '导入完成';
    if (progressFillEl) progressFillEl.style.width = '100%';
    showToast('房间已导入');
    return true;
}

if (generateExportCodeBtn) generateExportCodeBtn.addEventListener('click', () => { openExportCodeModal(); });
if (mobileGenerateExportCodeBtn) mobileGenerateExportCodeBtn.addEventListener('click', () => { openExportCodeModal(); });
if (exportCloseBtn) exportCloseBtn.addEventListener('click', closeExportCodeModal);
if (exportCodeModal) {
    exportCodeModal.addEventListener('click', (e) => {
        if (e.target === exportCodeModal) closeExportCodeModal();
    });
}
if (exportCopyBtn) {
    exportCopyBtn.addEventListener('click', async () => {
        let code = '';
        if (exportCodeText) {
            if ('value' in exportCodeText) code = exportCodeText.value;
            else code = exportCodeText.textContent;
        }
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            showToast('已复制房间码');
        } catch (e) {
            showToast('复制失败，请手动复制');
        }
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

    if (card && card.isCustom) {
        actions.push({
            label: '删除狂气',
            danger: true,
            action: () => {
                const list = getCustomMadnessCards();
                const exists = list.some(c => c && c.id === card.id);
                if (!exists) return;
                openConfirmDialog({
                    title: '确认删除原创狂气？',
                    message: `确定要删除「${card.name}」吗？`,
                    confirmText: '确认删除'
                }).then(confirmed => {
                    if (!confirmed) return;
                    const next = list.filter(c => !(c && c.id === card.id));
                    saveCustomMadnessCards(next);
                    renderCategoryFilter();
                    renderMadnessCards();
                    populateRandomDialogCategories();
                    showToast('已删除原创狂气');
                });
            }
        });
        actions.push({
            label: '删除分组',
            danger: true,
            action: () => {
                const category = card.category ? String(card.category) : '';
                if (!category) return;
                const list = getCustomMadnessCards();
                const count = list.filter(c => c && c.isCustom && String(c.category || '') === category).length;
                if (!count) return;
                openConfirmDialog({
                    title: '确认删除分组？',
                    message: `确定要删除分组「${category}」吗？该分组下的原创狂气将全部删除（${count}张）。`,
                    confirmText: '确认删除'
                }).then(confirmed => {
                    if (!confirmed) return;
                    const next = list.filter(c => !(c && c.isCustom && String(c.category || '') === category));
                    saveCustomMadnessCards(next);
                    renderCategoryFilter();
                    renderMadnessCards();
                    populateRandomDialogCategories();
                    showToast('已删除分组');
                });
            }
        });
    }

    actions.forEach(act => {
        const item = document.createElement('div');
        item.className = `context-menu-item ${act.danger ? 'danger' : ''}`;
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
    if (typeof window.openCreateRoomModal === 'function') {
        window.openCreateRoomModal();
        return;
    }
    const modal = document.getElementById('create-room-modal');
    if (modal) modal.classList.remove('hidden');
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

    const room = getCurrentRoom();
    if (room) {
        if (!room.characters) room.characters = [];
        const used = new Set(room.characters.map(c => (c && typeof c.color === 'string' ? c.color.toLowerCase() : '')).filter(Boolean));
        const color = pickUniqueRandomColor(used);
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
    charModal.classList.add('hidden');
});


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
    saveCardPositions(); // Save positions before re-rendering
    characterListDiv.innerHTML = '';
    if (!room.characters) room.characters = [];
    const useMobileColumns = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    let pendingEmptyCol = null;
    let pendingEmptyCount = 0;
    
    room.characters.forEach((char, index) => {
        if (!char.color) char.color = CHARACTER_COLORS[index % CHARACTER_COLORS.length];
        if (!char.emoji) char.emoji = AVATAR_EMOJIS[index % AVATAR_EMOJIS.length];

        const charEl = document.createElement('div');
        charEl.className = 'character-card-container';
        charEl.dataset.charId = char.id;
        if (char.color) setCharColorVars(charEl, char.color);
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
            selectCharacter(char.id);
            openCharacterInfoModal(char.id);
        };
        nameRow.appendChild(nameSpan);

        const statsSpan = document.createElement('span');
        statsSpan.className = 'char-stats-inline';
        statsSpan.textContent = formatCharStatsText(char);
        statsSpan.onclick = (e) => {
            e.stopPropagation();
            selectCharacter(char.id);
            openCharacterInfoModal(char.id);
        };
        nameRow.appendChild(statsSpan);
        
        infoSection.appendChild(nameRow);

        // Tags / Meta
        const metaRow = document.createElement('div');
        metaRow.className = 'char-meta-row';
        
        const revealedCount = char.cards.filter(c => c.isRevealed).length;
        metaRow.innerHTML = `
            <span class="char-tag">狂气: ${char.cards.length}</span>
            ${revealedCount > 0 ? `<span class="char-tag danger">已触发: ${revealedCount}</span>` : ''}
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
        if (char.cards.length === 0) handSection.classList.add('is-empty');
        
        const gridInner = document.createElement('div');
        gridInner.className = 'char-hand-grid-inner';

        if (char.cards.length > 0) {
            char.cards.forEach(card => {
                const miniCard = document.createElement('div');
                miniCard.className = `char-mini-card ${card.isRevealed ? 'revealed' : ''}`;
                miniCard.dataset.cardId = card.uniqueId; // Add ID for animation
                
                if (card.isRevealed) {
                    miniCard.textContent = card.name;
                    
                    // Set char count for CSS-based dynamic sizing
                    miniCard.style.setProperty('--char-count', card.name.length);
                    miniCard.style.fontSize = ''; // Ensure no inline override from previous logic

                    // Only show revealOrder if > 0
                    if (card.revealOrder > 0) {
                        const badge = document.createElement('div');
                        badge.className = 'card-reveal-badge';
                        badge.textContent = card.revealOrder;
                        miniCard.appendChild(badge);
                    }
                } else {
                    const backImg = card.isNewFormat ? 'img/【新ins】狂气卡背.png' : 'img/卡背.png';
                    miniCard.style.backgroundImage = `url('${backImg}')`;
                    miniCard.style.backgroundSize = 'cover';
                    
                    if (card.drawnOrder) {
                        const badge = document.createElement('div');
                        badge.className = 'card-drawn-badge';
                        badge.textContent = card.drawnOrder;
                        miniCard.appendChild(badge);
                    }
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
        if (!useMobileColumns) {
            characterListDiv.appendChild(charEl);
        } else {
            const hasMadness = Array.isArray(char.cards) && char.cards.length > 0;
            if (hasMadness) {
                if (pendingEmptyCol) {
                    characterListDiv.appendChild(pendingEmptyCol);
                    pendingEmptyCol = null;
                    pendingEmptyCount = 0;
                }
                const col = document.createElement('div');
                col.className = 'char-card-col';
                col.appendChild(charEl);
                characterListDiv.appendChild(col);
            } else {
                if (!pendingEmptyCol) {
                    pendingEmptyCol = document.createElement('div');
                    pendingEmptyCol.className = 'char-card-col';
                    pendingEmptyCount = 0;
                }
                pendingEmptyCol.appendChild(charEl);
                pendingEmptyCount += 1;
                if (pendingEmptyCount >= 2) {
                    characterListDiv.appendChild(pendingEmptyCol);
                    pendingEmptyCol = null;
                    pendingEmptyCount = 0;
                }
            }
        }
    });

    if (pendingEmptyCol) {
        characterListDiv.appendChild(pendingEmptyCol);
        pendingEmptyCol = null;
        pendingEmptyCount = 0;
    }

    // Add Character Button Card
    const addBtn = document.createElement('div');
    addBtn.className = 'character-card-container add-char-card';
    addBtn.innerHTML = '<span>+</span>';
    addBtn.title = '新建角色';
    addBtn.onclick = () => addCharBtn.click();
    if (!useMobileColumns) {
        characterListDiv.appendChild(addBtn);
    } else {
        const col = document.createElement('div');
        col.className = 'char-card-col';
        col.appendChild(addBtn);
        characterListDiv.appendChild(col);
    }
    
    // Trigger FLIP animation
    animateCardPositions();
}

// Store previous positions for FLIP animation
const cardPositions = new Map();

function saveCardPositions() {
    cardPositions.clear();
    document.querySelectorAll('.char-mini-card').forEach(card => {
        // Use a unique key based on card content or ID if available. 
        // We don't have unique IDs on the element easily accessible unless we add them.
        // Let's assume order might change, so we need a stable ID.
        // We can add data-id to mini-cards.
        const id = card.dataset.cardId;
        if (id) {
            const rect = card.getBoundingClientRect();
            cardPositions.set(id, { left: rect.left, top: rect.top });
        }
    });
}

function animateCardPositions() {
    document.querySelectorAll('.char-mini-card').forEach(card => {
        const id = card.dataset.cardId;
        const prev = cardPositions.get(id);
        if (prev) {
            const current = card.getBoundingClientRect();
            const deltaX = prev.left - current.left;
            const deltaY = prev.top - current.top;
            
            if (deltaX !== 0 || deltaY !== 0) {
                // Invert
                card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                card.style.transition = 'none';
                
                // Force reflow
                void card.offsetHeight;

                // Play
                requestAnimationFrame(() => {
                    card.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)';
                    card.style.transform = '';
                });
            }
        }
    });
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
                
                const room = getCurrentRoom();
                const char = room.characters.find(c => c.id === charId);
                
                if (char) {
                    if (card.isRevealed) {
                        // Newly Revealed: Assign timestamp for sorting
                        if (!card.revealedAt) {
                            card.revealedAt = Date.now();
                        }
                    } else {
                        // Hidden: Clear timestamp (moves back to unrevealed queue)
                        card.revealedAt = null;
                        card.revealOrder = null; // Clear old static order if present
                    }
                    
                    // Re-sort and Re-index Revealed Cards
                    // 1. Separate Revealed and Unrevealed
                    const revealedCards = char.cards.filter(c => c.isRevealed);
                    const unrevealedCards = char.cards.filter(c => !c.isRevealed);
                    
                    // 2. Sort Revealed by Timestamp (Oldest first)
                    revealedCards.sort((a, b) => (a.revealedAt || 0) - (b.revealedAt || 0));
                    
                    // 3. Assign dynamic display index (1, 2, 3...)
                    revealedCards.forEach((c, index) => {
                        c.revealOrder = index + 1; // Update display number
                    });
                    
                    // 4. Sort Unrevealed by Drawn Order
                    unrevealedCards.sort((a, b) => (a.drawnOrder || 0) - (b.drawnOrder || 0));
                    
                    // 5. Merge Back
                    char.cards = [...revealedCards, ...unrevealedCards];
                }
                
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
        <div class="char-hand-list">
    `;

    if (charCounts.length === 0) {
        html += `<div class="muted-small">无角色</div>`;
    } else {
        room.characters.forEach(char => {
            const unrevealedCards = char.cards.filter(c => !c.isRevealed);
            const handSize = unrevealedCards.length;
            let badgeClass = 'hand-count-badge';
            
            if (handSize === 3) {
                badgeClass += ' warn';
            } else if (handSize >= 4) {
                badgeClass += ' danger';
            }

            // Prepare names
            const handNames = unrevealedCards.map(c => `【${c.name}】`).join(' ') || '无手牌';

            html += `
                <div class="char-hand-item-wrapper">
                    <div class="char-hand-header" onclick="this.nextElementSibling.classList.toggle('hidden');">
                        <span class="char-name-compact" title="${char.name}">${char.name}</span>
                        <span class="${badgeClass}">${handSize}</span>
                    </div>
                    <div class="char-hand-detail hidden">
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
        html += `<div class="muted-small">无</div>`;
    } else {
        charRevealed.forEach(str => {
             // Split name and content
             const [name, content] = str.split(': ');
             html += `
                <div class="revealed-row">
                    <span class="revealed-name">${name}:</span>
                    <span class="revealed-content">${content}</span>
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
    renderMadnessCards(); // Refresh Library UI
}

function removeFromDeck(cardToRemove) {
    const room = getCurrentRoom();
    if (!room) return;
    room.deck = room.deck.filter(c => c.uniqueId !== cardToRemove.uniqueId);
    saveData();
    updateDeckVisuals(room);
    renderMadnessCards(); // Refresh Library UI
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
        
        // Calculate Drawn Order
        const maxDrawn = char.cards.reduce((max, c) => Math.max(max, c.drawnOrder || 0), 0);
        
        char.cards.push({ 
            ...card, 
            isRevealed: false,
            drawnOrder: maxDrawn + 1,
            revealOrder: null // Reset
        });
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
        // Track drawn order locally
        let currentMaxDrawn = char.cards.reduce((max, c) => Math.max(max, c.drawnOrder || 0), 0);

        for(let i=0; i<count; i++) {
            // Draw from Top (End of array)
            const card = room.deck.pop();
            currentMaxDrawn++;
            
            // Add to character hand
            char.cards.push({
                ...card,
                isRevealed: false, // Face down initially
                drawnOrder: currentMaxDrawn,
                revealOrder: null
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
