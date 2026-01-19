import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';

const md: any = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  }
};

@Component({
    selector: 'app-fixedplugin',
    templateUrl: './fixedplugin.component.html',
    styleUrls: ['./fixedplugin.component.css'],
    imports: [CommonModule]
})

export class FixedpluginComponent implements OnInit, OnDestroy {

  private cleanupFunctions: (() => void)[] = [];

  constructor() { }

  ngOnInit() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const sidebarImgContainer = sidebar?.querySelector('.sidebar-background') as HTMLElement;
    const fullPage = document.querySelector('.full-page') as HTMLElement;
    const sidebarResponsive = document.querySelector('body > .navbar-collapse') as HTMLElement;
    const windowWidth = window.innerWidth;

    const fixedPluginOpenEl = document.querySelector('.sidebar .sidebar-wrapper .nav li.active a p');
    const fixedPluginOpen = fixedPluginOpenEl?.innerHTML;

    if (windowWidth > 767 && fixedPluginOpen === 'Dashboard') {
      const dropdown = document.querySelector('.fixed-plugin .dropdown');
      if (dropdown?.classList.contains('show-dropdown')) {
        dropdown.classList.add('open');
      }
    }

    // Click handler for fixed-plugin anchors
    const fixedPluginLinks = document.querySelectorAll('.fixed-plugin a');
    fixedPluginLinks.forEach(link => {
      const clickHandler = (event: Event) => {
        if ((link as HTMLElement).classList.contains('switch-trigger')) {
          event.stopPropagation();
        }
      };
      link.addEventListener('click', clickHandler);
      this.cleanupFunctions.push(() => link.removeEventListener('click', clickHandler));
    });

    // Active color span click handler
    const activeColorSpans = document.querySelectorAll('.fixed-plugin .active-color span');
    activeColorSpans.forEach(span => {
      const clickHandler = () => {
        const siblings = span.parentElement?.children;
        if (siblings) {
          Array.from(siblings).forEach(sibling => sibling.classList.remove('active'));
        }
        span.classList.add('active');
        const newColor = (span as HTMLElement).dataset['color'];

        if (sidebar) {
          sidebar.setAttribute('data-color', newColor || '');
        }
        if (fullPage) {
          fullPage.setAttribute('filter-color', newColor || '');
        }
        if (sidebarResponsive) {
          sidebarResponsive.setAttribute('data-color', newColor || '');
        }
      };
      span.addEventListener('click', clickHandler);
      this.cleanupFunctions.push(() => span.removeEventListener('click', clickHandler));
    });

    // Background color span click handler
    const backgroundColorSpans = document.querySelectorAll('.fixed-plugin .background-color span');
    backgroundColorSpans.forEach(span => {
      const clickHandler = () => {
        const siblings = span.parentElement?.children;
        if (siblings) {
          Array.from(siblings).forEach(sibling => sibling.classList.remove('active'));
        }
        span.classList.add('active');
        const newColor = (span as HTMLElement).dataset['color'];

        if (sidebar) {
          sidebar.setAttribute('data-background-color', newColor || '');
        }
      };
      span.addEventListener('click', clickHandler);
      this.cleanupFunctions.push(() => span.removeEventListener('click', clickHandler));
    });

    // Image holder click handler
    const imgHolders = document.querySelectorAll('.fixed-plugin .img-holder');
    imgHolders.forEach(holder => {
      const clickHandler = () => {
        const fullPageBackground = document.querySelector('.full-page-background') as HTMLElement;
        const parentLi = holder.parentElement;
        const siblings = parentLi?.parentElement?.children;

        if (siblings) {
          Array.from(siblings).forEach(sibling => sibling.classList.remove('active'));
        }
        parentLi?.classList.add('active');

        const img = holder.querySelector('img') as HTMLImageElement;
        let newImage = img?.getAttribute('src') || '';

        const switchImageChecked = document.querySelector('.switch-sidebar-image input:checked');

        if (sidebarImgContainer && switchImageChecked) {
          this.fadeOut(sidebarImgContainer, () => {
            sidebarImgContainer.style.backgroundImage = `url("${newImage}")`;
            this.fadeIn(sidebarImgContainer);
          });
        }

        if (fullPageBackground && switchImageChecked) {
          const activeImgHolder = document.querySelector('.fixed-plugin li.active .img-holder img') as HTMLImageElement;
          const newImageFullPage = activeImgHolder?.dataset['src'] || '';

          this.fadeOut(fullPageBackground, () => {
            fullPageBackground.style.backgroundImage = `url("${newImageFullPage}")`;
            this.fadeIn(fullPageBackground);
          });
        }

        if (!switchImageChecked) {
          const activeImgHolder = document.querySelector('.fixed-plugin li.active .img-holder img') as HTMLImageElement;
          newImage = activeImgHolder?.getAttribute('src') || '';
          const newImageFullPage = activeImgHolder?.dataset['src'] || '';

          if (sidebarImgContainer) {
            sidebarImgContainer.style.backgroundImage = `url("${newImage}")`;
          }
          if (fullPageBackground) {
            fullPageBackground.style.backgroundImage = `url("${newImageFullPage}")`;
          }
        }

        if (sidebarResponsive) {
          sidebarResponsive.style.backgroundImage = `url("${newImage}")`;
        }
      };
      holder.addEventListener('click', clickHandler);
      this.cleanupFunctions.push(() => holder.removeEventListener('click', clickHandler));
    });

    // Switch sidebar image change handler
    const switchSidebarImageInput = document.querySelector('.switch-sidebar-image input') as HTMLInputElement;
    if (switchSidebarImageInput) {
      const changeHandler = () => {
        const fullPageBackground = document.querySelector('.full-page-background') as HTMLElement;

        if (switchSidebarImageInput.checked) {
          if (sidebarImgContainer) {
            this.fadeIn(sidebarImgContainer);
            sidebar?.setAttribute('data-image', '#');
          }
          if (fullPageBackground) {
            this.fadeIn(fullPageBackground);
            fullPage?.setAttribute('data-image', '#');
          }
        } else {
          if (sidebarImgContainer) {
            sidebar?.removeAttribute('data-image');
            this.fadeOut(sidebarImgContainer);
          }
          if (fullPageBackground) {
            fullPage?.removeAttribute('data-image');
            this.fadeOut(fullPageBackground);
          }
        }
      };
      switchSidebarImageInput.addEventListener('change', changeHandler);
      this.cleanupFunctions.push(() => switchSidebarImageInput.removeEventListener('change', changeHandler));
    }

    // Switch sidebar mini change handler
    const switchSidebarMiniInput = document.querySelector('.switch-sidebar-mini input') as HTMLInputElement;
    if (switchSidebarMiniInput) {
      const changeHandler = () => {
        const body = document.body;

        if (md.misc.sidebar_mini_active === true) {
          body.classList.remove('sidebar-mini');
          md.misc.sidebar_mini_active = false;
        } else {
          setTimeout(() => {
            body.classList.add('sidebar-mini');
            const collapseElements = document.querySelectorAll('.sidebar .collapse') as NodeListOf<HTMLElement>;
            collapseElements.forEach(el => el.style.height = 'auto');
            md.misc.sidebar_mini_active = true;
          }, 300);
        }

        // Simulate window resize so charts get updated in realtime
        const simulateWindowResize = setInterval(() => {
          window.dispatchEvent(new Event('resize'));
        }, 180);

        // Stop the simulation after animations complete
        setTimeout(() => {
          clearInterval(simulateWindowResize);
        }, 1000);
      };
      switchSidebarMiniInput.addEventListener('change', changeHandler);
      this.cleanupFunctions.push(() => switchSidebarMiniInput.removeEventListener('change', changeHandler));
    }
  }

  ngOnDestroy() {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }

  private fadeOut(element: HTMLElement, callback?: () => void) {
    element.style.transition = 'opacity 150ms';
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.display = 'none';
      if (callback) callback();
    }, 150);
  }

  private fadeIn(element: HTMLElement, callback?: () => void) {
    element.style.display = '';
    element.style.opacity = '0';
    element.style.transition = 'opacity 150ms';
    setTimeout(() => {
      element.style.opacity = '1';
      if (callback) callback();
    }, 10);
  }

}
