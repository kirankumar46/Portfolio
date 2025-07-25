/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

function submitForm() {
    // Clear the form fields
    document.getElementById('contactForm').reset();

    // Show the alert message
    alert("Thank you for contacting!");
}


/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text,.bd-work, .skills__img,.resume__content',{delay: 400}); 
sr.reveal('.home__social-icon,.resume__container',{ interval: 200}); 
sr.reveal('.skills__data, .work__img,.work__container,.contact_email,.contact_phone',{interval: 200}); 

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or banner
    showInstallPromotion();
});

function showInstallPromotion() {
    // Create install button if it doesn't exist
    if (!document.getElementById('install-button')) {
        const installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.textContent = 'Install App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--first-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transition: transform 0.2s ease;
        `;
        
        installButton.addEventListener('mouseenter', () => {
            installButton.style.transform = 'scale(1.05)';
        });
        
        installButton.addEventListener('mouseleave', () => {
            installButton.style.transform = 'scale(1)';
        });
        
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                // Clear the deferredPrompt variable
                deferredPrompt = null;
                // Hide the install button
                installButton.remove();
            }
        });
        
        document.body.appendChild(installButton);
    }
}

// Handle successful installation
window.addEventListener('appinstalled', (evt) => {
    console.log('Portfolio PWA was installed');
    // Hide install button if it exists
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.remove();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
    // You can show a notification here
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    // You can show an offline notification here
});