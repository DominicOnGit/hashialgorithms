/* eslint-disable @typescript-eslint/no-explicit-any */
// enables v-focus in templates
export const vElementDeselected = {
  mounted: function (el: any, binding: any, vnode: any): void {
    el.globalClickEvent = function (event: any) {
      const { handler, exclude } = binding.value;
      if (!isInDom(event.target)) {
        return;
      }
      let clickedOutsideExclusion: boolean;
      if (exclude == null) {
        clickedOutsideExclusion = el !== event.target && !el.contains(event.target);
      } else {
        clickedOutsideExclusion = exclude.every((refName: string) => {
          const excludedEl = vnode.ctx.refs[refName];
          if (excludedEl instanceof Array) {
            return excludedEl.every(
              (excludedArrayEl) =>
                excludedArrayEl !== event.target && !excludedArrayEl.contains(event.target)
            );
          }
          return excludedEl !== event.target && !excludedEl.contains(event.target);
        });
      }
      if (clickedOutsideExclusion) {
        handler(event);
      }
    };
    document.body.addEventListener('click', el.globalClickEvent);
    document.body.addEventListener('touchstart', el.globalClickEvent);
  },
  unmounted: function (el: any): void {
    document.body.removeEventListener('click', el.globalClickEvent);
    document.body.removeEventListener('touchstart', el.globalClickEvent);
  }
};

function isInDom(element: HTMLElement): boolean {
  let el: HTMLElement | null = element;
  while (el != null) {
    if (el.localName === 'html') return true;
    el = el.parentElement;
  }
  return false;
}

// enables v-focus in templates
export const vElementDeselectedByParentId = {
  mounted: function (el: any, binding: any): void {
    el.globalClickEvent = function (event: any) {
      const { handler, exclude } = binding.value;
      let excludedEl = el as HTMLElement;
      if (exclude != null) {
        while (excludedEl.id !== exclude && excludedEl.parentElement != null) {
          excludedEl = excludedEl.parentElement;
        }
        if (excludedEl.id !== exclude) throw new Error(`no parent element ${exclude} found`);
      }
      if (excludedEl !== event.target && !excludedEl.contains(event.target)) {
        handler(event);
      }
    };
    document.body.addEventListener('click', el.globalClickEvent);
    document.body.addEventListener('touchstart', el.globalClickEvent);
  },
  unmounted: function (el: any): void {
    document.body.removeEventListener('click', el.globalClickEvent);
    document.body.removeEventListener('touchstart', el.globalClickEvent);
  }
};
