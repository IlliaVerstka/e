let slideUp = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideDown = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideToggle = (target, duration = 400) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
}
function testWebP(callback) {
   var webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
   if (support == true) {
      document.querySelector('body').classList.add('webp');
   }
});
class Me {
   constructor(type) {
      this.typeMedia = type
   }
   init() {
      this.elements = document.querySelectorAll('[data-me]')
      this.objects = []

      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const meElement = this.elements[index];

            const obj = {}
            obj.el = meElement
            const dataAttr = meElement.dataset.me.split(',').map(item => item.trim())
            obj.dataAttr = {
               size: dataAttr[0],
               block: dataAttr[1],
               index: dataAttr[2],
            }
            obj.parentElement = obj.el.parentElement
            obj.indexParent = Array.from(obj.parentElement.children).indexOf(obj.el)
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${this.typeMedia}-width:${obj.dataAttr.size}px)`)
            this.mediaHandler(mediaQueryList, obj)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj))
         }
      }
   }
   mediaHandler(e, obj) {
      if (e.matches) {
         obj.el.classList.add('-me')
         this.moveTo(obj.el, obj.dataAttr.block, obj.dataAttr.index)
      } else {
         obj.el.classList.remove('-me')
         this.moveBack(obj.el, obj.parentElement, obj.indexParent)
      }
   }
   moveTo(element, block, index) {
      if (document.querySelector(block)) {
         const toBlock = document.querySelector(block)
         const blockChildren = toBlock.children
         const indexBlock = index == 'first' ? 0 :
            index == 'last' ? undefined :
               index;

         if (blockChildren[indexBlock] != undefined) {
            blockChildren[indexBlock].insertAdjacentElement(
               'beforebegin',
               element
            )
         } else {
            toBlock.insertAdjacentElement(
               'beforeend',
               element
            )
         }
      }
   }
   moveBack(element, parentElement, index) {
      const blockChildren = parentElement.children

      if (blockChildren[index] != undefined) {
         blockChildren[index].insertAdjacentElement(
            'beforebegin',
            element
         )
      } else {
         parentElement.insertAdjacentElement(
            'beforeend',
            element
         )
      }
   }
}
const me = new Me('max')
me.init()
class ValidateForm {
   constructor(form, objUser) {
      this.form = form
      this.objUser = objUser
      form.addEventListener('submit', e => this.formSend(e, this, form, objUser))
   }
   async formSend(e, thisClass, form, objUser) {
      e.preventDefault()
      const error = thisClass.validateForm(form, objUser)

      if (error === 0) {
         form.classList.add('-sending')
         const formData = new FormData(form)

         const response = await fetch(objUser.url, {
            method: objUser.method,
            // body: formData
         })
         if (response.ok) {
            // const result = await response.json();
            console.log('result');
         } else {
            console.log('Error');
         }

         form.reset()
         if (objUser.items.input && objUser.items.input.length > 0) {
            objUser.items.input.forEach(input => {
               input.blur()
            })
         }
         if (form.querySelectorAll('.-custom-select')) {
            const customSelect = form.querySelectorAll('.-custom-select')
            customSelect.forEach(select => select.reset())
         }
         form.classList.remove('-sending')
      } else {
         console.log('Emptly');
      }
   }
   validateForm(form, objUser) {
      let error = 0;
      for (const prop in objUser.items) {
         const elements = objUser.items[prop]

         if (prop == 'input') {
            if (elements.length > 0) {
               elements.forEach(input => {
                  this.removeError(input)

                  if (input.classList.contains('-tel')) {
                     if (this.telTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-email')) {
                     if (this.emailTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-password')) {
                     if (input.value.length < 8 || input.value.length > 10) {
                        this.addError(input)
                        error++
                        if (input.value.length < 8) {
                           console.log('passswod 8');
                        }
                        if (input.value.length > 10) {
                           console.log('passswod 10');
                        }
                     }
                  } else {
                     if (!input.value) {
                        this.addError(input)
                        error++
                     }
                  }
               })
            }
         }
         if (prop == 'checkbox') {
            if (elements.length > 0) {
               elements.forEach(checkbox => {
                  this.removeError(checkbox)
                  if (!checkbox.checked) {
                     this.addError(checkbox)
                     error++
                  }
               })
            }
         }
         if (prop == 'radio') {
            if (elements.length > 0) {
               const groupsRadio = {}
               elements.forEach(radio => {
                  if (!groupsRadio[radio.name]) {
                     groupsRadio[radio.name] = []
                  }
                  groupsRadio[radio.name].push(radio)
               })
               for (const prop in groupsRadio) {
                  const groupRadio = groupsRadio[prop]
                  const checkedRadio = Array.from(groupRadio).filter(radio => radio.checked)[0]

                  groupRadio.forEach(radio => {
                     this.removeError(radio)
                  })
                  if (!checkedRadio) {
                     groupRadio.forEach(radio => {
                        this.addError(radio)
                        error++
                     })
                  }
               }
            }
         }
         if (prop == 'select') {
            if (elements.length > 0) {
               elements.forEach(select => {
                  select.classList.remove('-error')
                  if (select.classList.contains('-custom-select-no-choose')) {
                     select.classList.add('-error')
                     error++
                  }
               })
            }
         }
      }
      return error;
   }
   removeError(input) {
      input.parentElement.classList.remove('-error')
      input.classList.remove('-error')
      const form = input.closest('form')
      if (form.classList.contains('-error')) {
         form.classList.remove('-error')
      }
   }
   addError(input) {
      input.parentElement.classList.add('-error')
      input.classList.add('-error')
      const form = input.closest('form')
      if (!form.classList.contains('-error')) {
         form.classList.add('-error')
      }
   }
   emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }
   telTest(input) {
      return !/^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{5,10}$/.test(input.value);
   }
}

const inputsValue = document.querySelectorAll('[data-value]')
if (inputsValue.length > 0) {
   inputsValue.forEach(input => {
      const placeholderValue = input.dataset.value;

      if (!input.value) {
         input.placeholder = placeholderValue
      }

      input.addEventListener('focus', () => {
         input.placeholder = ''
      })
      input.addEventListener('blur', () => {
         input.placeholder = placeholderValue
      })
   })
}
class Tabs {
   init() {
      this.elements = document.querySelectorAll('[data-tab]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const tab = this.elements[index];
            const obj = {}
            obj.el = tab
            obj.items = obj.el.querySelectorAll('[data-tab-item]')
            obj.contents = obj.el.querySelectorAll('[data-tab-content]')
            obj.activeItems = Array.from(obj.items).filter(item => item.classList.contains('-active'))
            obj.itemLabel = obj.el.hasAttribute('data-tab-item-label')

            const mediaSettings = obj.el.dataset.tab.split(',').map(item => item.trim())
            obj.mediaSettings = {
               type: mediaSettings[0],
               size: mediaSettings[1],
            }
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${obj.mediaSettings.type}-width:${obj.mediaSettings.size}px)`)
            this.mediaHandler(mediaQueryList, obj.el, obj.items, obj.contents, obj.activeItems, obj.itemLabel)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj.el, obj.items, obj.contents, obj.activeItems, obj.itemLabel))
         }
      }
   }
   mediaHandler(e, tabElement, items, contents, activeItems, itemLabel) {
      if (e.matches) {
         let activeItems = []
         const inactiveItems = []
         items.forEach(item => item.classList.contains('-active') ? activeItems.push(item) : inactiveItems.push(item))
         if (activeItems.length > 0) {
            if (activeItems.length > 1) {
               items.forEach(item => item.classList.remove('-active'))
               items[0].classList.add('-active')
               activeItems = [items[0]]
               if (itemLabel) {
                  slideDown(activeItems[0].nextElementSibling, 0)
               }
            }
            if (itemLabel) {
               activeItems.forEach(item => slideDown(item.nextElementSibling, 0))
               items.forEach(item => {
                  slideUp(item.nextElementSibling, 0)
               })
            }
         } else {
            items[0].classList.add('-active')
            activeItems = [items[0]]
            if (itemLabel) {
               activeItems.forEach(item => slideDown(item.nextElementSibling, 0))
               items.forEach(item => {
                  slideUp(item.nextElementSibling, 0)
               })
            }
         }
         activeItems.forEach(item => {
            const activeContent = []
            const inactiveContent = []
            contents.forEach(content => content.dataset.tabContent == item.dataset.tabItem ? activeContent.push(content) : inactiveContent.push(content))

            activeContent[0].classList.add('-active')
            this.animShow(activeContent[0], false)

            inactiveContent.forEach(content => {
               if (content.classList.contains('-active')) {
                  content.classList.remove('-active')
               }
               this.animHide(content, false)
            })
         })

         tabElement.contents = contents
         tabElement.thisCLass = this
         tabElement.items = items
         tabElement.itemLabel = itemLabel
         tabElement.addEventListener('click', this.actionTabElement)
      } else {
         items.forEach(item => {
            item.classList.remove('-active')
            if (itemLabel) {
               items.forEach(item => {
                  slideDown(item.nextElementSibling, 0)
               })
            }
         })
         contents.forEach(content => {
            content.classList.remove('-active')
            this.animShow(content, false, true)
         })
         if (activeItems) {
            activeItems.forEach(item => item.classList.add('-active'))
         }

         tabElement.removeEventListener('click', this.actionTabElement)
      }
   }
   actionTabElement(e) {
      const target = e.target
      const contents = e.currentTarget.contents
      const thisCLass = e.currentTarget.thisCLass
      const items = e.currentTarget.items
      const itemLabel = e.currentTarget.itemLabel
      const animContents = Array.from(contents).filter(content => content.classList.contains('-anim'))

      if (target.closest('[data-tab-item]')) {
         e.preventDefault()
         if (animContents.length === 0) {
            const item = target.closest('[data-tab-item]')

            if (!item.classList.contains('-active')) {
               let activeContent;
               const inactiveContent = []
               contents.forEach(content => content.dataset.tabContent == item.dataset.tabItem ? activeContent = content : inactiveContent.push(content))

               items.forEach(item => item.classList.remove('-active'))
               item.classList.add('-active')

               activeContent.classList.add('-active')
               thisCLass.animShow(activeContent)
               inactiveContent.forEach(content => {
                  thisCLass.animHide(content)
                  content.classList.remove('-active')
               })
               if (itemLabel) {
                  slideDown(item.nextElementSibling)
                  items.forEach(item => {
                     slideUp(item.nextElementSibling)
                  })
               }
            }
         }
      }
   }
   animHide(el, anim = true) {
      if (anim) {
         el.style.opacity = '0'
         el.classList.add('-anim')
         setTimeout(() => {
            el.style.display = 'none'
            el.classList.remove('-anim')
         }, 200)
      } else {
         el.style.opacity = '0'
         el.style.display = 'none'
      }
   }
   animShow(el, anim = true, removeStyle = false) {
      if (anim) {
         setTimeout(() => {
            el.style.display = 'block'
            el.classList.add('-anim')
            setTimeout(() => {
               el.style.opacity = '1'
               el.classList.remove('-anim')
            }, 200)
         }, 200)
      } else {
         el.style.opacity = '1'
         el.style.display = 'block'
      }
      if (removeStyle) {
         el.style.removeProperty('opacity')
         el.style.removeProperty('display')
      }
   }
}
const tabs = new Tabs()
tabs.init()
class CustomSelect {
   init() {
      this.elements = document.querySelectorAll('[data-custom-select]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const select = this.elements[index];

            const obj = {}
            obj.select = select
            obj.options = obj.select.options
            obj.selectedIndex = obj.select.selectedIndex
            obj.className = obj.select.classList[0]
            obj.mLabel = obj.select.hasAttribute('data-custom-select-mlabel') ? obj.select.dataset.customSelectMlabel : false
            obj.label = obj.select.hasAttribute('data-custom-select-label') ? obj.select.dataset.customSelectLabel : false

            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            obj.select.className = ''
            obj.select.style.display = 'none'
            this.createStructure(obj.select, obj.options, obj.className, obj.mLabel, obj.label)

            obj.customSelect = {}
            obj.customSelect.select = obj.select.nextElementSibling
            obj.customSelect.openner = obj.customSelect.select.querySelector('.-custom-select__openner')
            obj.customSelect.value = obj.customSelect.select.querySelector('.-custom-select__value')
            obj.customSelect.icon = obj.customSelect.select.querySelector('.-custom-select__icon')
            obj.customSelect.body = obj.customSelect.select.querySelector('.-custom-select__body')
            obj.customSelect.items = obj.customSelect.select.querySelectorAll('.-custom-select__item')
            this.fillContent(obj)

            const customSelect = obj.customSelect

            if (!obj.label) {
               customSelect.items[obj.select.selectedIndex].classList.add('-active')
            } else {
               customSelect.select.classList.add('-custom-select-no-choose')
            }

            slideUp(customSelect.body, 0)
            customSelect.select.addEventListener('click', e => this.actionCustomSelect(e, obj.label, obj.select, obj.options))
            document.addEventListener('click', this.actionDocument)

            const thisClass = this
            customSelect.select.reset = function () {
               const activeItem = customSelect.items[obj.selectedIndex]
               thisClass.activeOption(activeItem, obj.select, obj.options, customSelect.select, obj.label)
            }
         }
      }
   }
   createStructure(select, options, className, mLabel, label) {
      const templateWrapStart = `<div class="${className} -custom-select">`
      const templateWrapEnd = `</div>`

      const templateOpennerStart = `<a href="" class="${className}__openner -custom-select__openner">`
      const templateOpennerEnd = `</a>`
      const templateValue = `<div class="${className}__value -custom-select__value">${label ? label : ''}</div>`
      const templateIcon = `<div class="${className}__icon -custom-select__icon"></div>`

      const templateMlable = mLabel ? `<div class="${className}__mlabel -custom-select__mlabel">${mLabel}</div>` : ''
      const templateOpenner = templateOpennerStart + templateMlable + templateValue + templateIcon + templateOpennerEnd

      const templateBodyStart = `<div class="${className}__body -custom-select__body">`
      const templateBodyEnd = `</div>`
      let templateItems = ''
      for (let index = 0; index < options.length; index++) {
         const templateItem = `<div class="${className}__item -custom-select__item"></div>`
         templateItems += templateItem
      }
      const templateBody = templateBodyStart + templateItems + templateBodyEnd
      const templateCustomSelect = templateWrapStart + templateOpenner + templateBody + templateWrapEnd
      select.insertAdjacentHTML(
         'afterend',
         templateCustomSelect
      )
   }
   fillContent(obj) {
      const selectedOption = obj.options[obj.select.selectedIndex]
      if (!obj.label) {
         obj.customSelect.value.innerHTML = selectedOption.innerHTML
      }

      const contentOptions = Array.from(obj.options).map(item => item.innerHTML)
      obj.customSelect.items.forEach((item, index) => item.innerHTML = contentOptions[index])
   }
   actionCustomSelect(e, label, select, options) {
      const target = e.target
      const customSelect = e.currentTarget
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectBody = customSelect.querySelector('.-custom-select__body')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')

      if (target.closest('.-custom-select__item')) {
         if (!document.querySelector('.-custom-select__body.-anim')) {
            if (label && customSelect.classList.contains('-custom-select-no-choose')) {
               customSelect.classList.remove('-custom-select-no-choose')
            }
            if (!target.classList.contains('-active')) {
               this.activeOption(target, select, options, customSelect)
            }
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
         }
      }
      if (target.closest('.-custom-select__openner')) {
         e.preventDefault()

         if (!document.querySelector('.-custom-select__body.-anim')) {
            const openner = target.closest('.-custom-select__openner')
            if (document.querySelector('.-custom-select.-open')) {
               const openCustomSelect = document.querySelector('.-custom-select.-open')

               if (openCustomSelect != customSelect) {
                  const customSelectBody = openCustomSelect.querySelector('.-custom-select__body')
                  slideUp(customSelectBody)
                  openCustomSelect.classList.remove('-open')
               }
            }

            if (!customSelect.classList.contains('-open')) {
               openner.vars = [this, select, options, customSelect, customSelectValue, customSelectBody, customSelectItems, label]
               openner.addEventListener('keydown', this.keydownOpenner)
               document.addEventListener('keydown', this.keydownDocument)
               openner.addEventListener('blur', this.blurOpenner)
            } else {
               openner.vars = []
               openner.removeEventListener('blur', this.blurOpenner)
               openner.removeEventListener('keydown', this.keydownOpenner)
               document.removeEventListener('keydown', this.keydownDocument)
            }

            customSelect.classList.toggle('-open')
            slideToggle(customSelectBody)
         }
      }
   }
   blurOpenner(e) {
      if (!document.querySelector('.-custom-select__body.-anim')) {
         const openner = e.target
         const thisClass = openner.vars[0]
         const customSelect = openner.vars[3]
         const customSelectBody = openner.vars[5]
         if (openner.eventKey == 'Tab') {
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
            openner.eventKey = undefined
         }

         openner.removeEventListener('blur', thisClass.blurOpenner)
         openner.removeEventListener('keydown', thisClass.keydownOpenner)
         document.removeEventListener('keydown', thisClass.keydownDocument)
      }

   }
   keydownDocument(e) {
      if (e.code == 'ArrowUp' || e.code == 'ArrowDown') {
         e.preventDefault()
      }
   }
   keydownOpenner(e) {
      const openner = e.target
      const thisClass = openner.vars[0]
      const select = openner.vars[1]
      const options = openner.vars[2]
      const customSelect = openner.vars[3]
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectBody = customSelect.querySelector('.-custom-select__body')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')
      const label = openner.vars[7]

      openner.eventKey = e.code

      if (e.code == 'Tab' && document.querySelector('.-custom-select__body.-anim')) {
         e.preventDefault()
      }

      if (!document.querySelector('.-custom-select__body.-anim')) {
         if (e.code == 'Escape') {
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
         }
         if (e.code == 'ArrowUp' || e.code == 'ArrowDown') {
            let activeItem = customSelect.querySelector('.-custom-select__item.-active')

            if (!activeItem) {
               activeItem = customSelectItems[0]
               thisClass.activeOption(activeItem, select, options, customSelect)

               if (label && customSelect.classList.contains('-custom-select-no-choose')) {
                  customSelect.classList.remove('-custom-select-no-choose')
               }

               return false;
            }
            if (e.code == 'ArrowUp' && activeItem.previousElementSibling) {
               thisClass.activeOption(activeItem.previousElementSibling, select, options, customSelect)
            }
            if (e.code == 'ArrowDown' && activeItem.nextElementSibling) {
               thisClass.activeOption(activeItem.nextElementSibling, select, options, customSelect)
            }
         }
      }
   }
   activeOption(item, select, options, customSelect, label = null) {
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')

      customSelectItems.forEach(item => item.classList.remove('-active'))
      select.selectedIndex = Array.from(customSelectItems).indexOf(item)
      if (!label) {
         const selectedIndex = select.selectedIndex
         customSelectItems[selectedIndex].classList.add('-active')

         customSelectValue.innerHTML = options[selectedIndex].innerHTML
      } else {
         customSelectValue.innerHTML = label
         const customSelect = customSelectValue.closest('.-custom-select')
         customSelect.classList.add('-custom-select-no-choose')
      }
   }
   actionDocument(e) {
      const target = e.target
      if (!target.closest('.-custom-select')) {
         if (document.querySelector('.-custom-select.-open')) {
            if (!document.querySelector('.-custom-select__body.-anim')) {
               const activeCustomSelect = document.querySelector('.-custom-select.-open')
               const customSelectBody = activeCustomSelect.querySelector('.-custom-select__body')

               activeCustomSelect.classList.remove('-open')
               slideUp(customSelectBody)
            }
         }
      }
   }
}
const customSelect = new CustomSelect()
customSelect.init()
class Spoller {
   init() {
      this.elements = document.querySelectorAll('[data-spollers]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const spoller = this.elements[index];
            const obj = {}
            obj.el = spoller
            obj.oneSpoller = obj.el.hasAttribute('data-one-spoller')
            obj.items = obj.el.querySelectorAll('[data-spoller-item]')
            const mediaSettings = obj.el.dataset.spollers.split(',').map(item => item.trim())
            obj.mediaSettings = {
               type: mediaSettings[0],
               size: mediaSettings[1],
            }
            obj.activeItems = Array.from(obj.items).filter(item => item.classList.contains('-active'))
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${obj.mediaSettings.type}-width:${obj.mediaSettings.size}px)`)

            this.mediaHandler(mediaQueryList, obj.el, obj.items, obj.activeItems, obj.oneSpoller)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj.el, obj.items, obj.activeItems, obj.oneSpoller))
         }
      }
   }
   mediaHandler(e, spollerElement, items, activeItems, oneSpoller) {
      if (e.matches) {
         const activeItems = []
         const inactiveItems = []
         items.forEach(item => item.classList.contains('-active') ? activeItems.push(item) : inactiveItems.push(item))

         if (activeItems.length > 0) {
            if (oneSpoller) {
               if (activeItems.length > 1) {
                  slideDown(items[0].nextElementSibling, 0)
                  activeItems.forEach(item => {
                     item.classList.remove('-active')
                     slideUp(item.nextElementSibling, 0)
                  })
                  items[0].classList.add('-active')
               } else if (activeItems.length == 1) {
                  slideDown(activeItems[0].nextElementSibling, 0)
               }
            } else {
               activeItems.forEach(item => {
                  slideDown(item.nextElementSibling, 0)
               })
            }
         } else {
            if (oneSpoller) {
               items[0].classList.add('-active')
               slideDown(items[0].nextElementSibling, 0)
            }
         }
         if (inactiveItems.length > 0) {
            inactiveItems.forEach(item => {
               slideUp(item.nextElementSibling, 0)
            })
         }
         
         spollerElement.items = items
         spollerElement.oneSpoller = oneSpoller
         spollerElement.addEventListener('click', this.actionSpollerElement)
      } else {
         if(spollerElement.querySelector('[data-spollers]')){
            document.querySelectorAll('[data-spoller-item-1]').forEach(item => {
               item.classList.remove('-active')
               slideDown(item.nextElementSibling, 0)
            })
            document.querySelectorAll('[data-spoller-item-2]').forEach(item => {
               item.classList.remove('-active')
               slideDown(item.nextElementSibling, 0)
            })
         }else {
            items.forEach(item => {
               item.classList.remove('-active')
               slideDown(item.nextElementSibling, 0)
            })
         }
         if (activeItems.length > 0) {
            activeItems.forEach(item => item.classList.add('-active'))
         }
         
         if(spollerElement.items && spollerElement.oneSpoller) {
            delete spollerElement.items
            delete spollerElement.oneSpoller
         }
         spollerElement.removeEventListener('click', this.actionSpollerElement)
      }
   }
   actionSpollerElement(e) {
      const target = e.target;
      const items = e.currentTarget.items;
      const oneSpoller = e.currentTarget.oneSpoller;
      const animContent = Array.from(items).filter(item => item.nextElementSibling.classList.contains('-anim'))

      if (target.closest('[data-spoller-item]')) {
         const item = target.closest('[data-spoller-item]')
         if (!item.querySelector('[data-spoller-openner]') || target.closest('[data-spoller-openner]')) {
            e.preventDefault()
            if (animContent.length === 0) {
               if (item.classList.contains('-active')) {
                  if (!oneSpoller) {
                     item.classList.remove('-active')
                     slideUp(item.nextElementSibling)
                  }
               } else {
                  slideDown(item.nextElementSibling)
                  if (oneSpoller) {
                     items.forEach(item => {
                        item.classList.remove('-active')
                        slideUp(item.nextElementSibling)
                     })
                  }
                  item.classList.add('-active')
               }
            }
         }
      }
   }
}
const spoller = new Spoller()
spoller.init()

document.addEventListener('click', actionDocument)
const headerElement = document.querySelector('.header')
function actionDocument(e) {
   const target = e.target;
   if (target.closest('.burger-header')) {
      const burgerMenu = target.closest('.burger-header')
      const menu = document.querySelector('.menu')
      burgerMenu.classList.add('-active')
      menu.classList.add('-open')
      headerElement.classList.add('-active')
      document.body.classList.add('-lock')
   }
   if (target.closest('.menu__close')) {
      e.preventDefault()
      const menuClose = target.closest('.menu__close')
      const burgerMenu = document.querySelector('.burger-header')
      const menu = document.querySelector('.menu')
      burgerMenu.classList.remove('-active')
      menu.classList.remove('-open')
      headerElement.classList.remove('-active')
      document.body.classList.remove('-lock')
   }
   if (target.closest('.form-filter__close')) {
      e.preventDefault()
      const formFilter = document.querySelector('.form-filter')
      formFilter.classList.remove('-open')
      document.body.classList.remove('-lock')
   }
   if (target.closest('.filter__openner')) {
      e.preventDefault()
      if(window.innerWidth < '767.98') {
         console.log(3);
         const formFilter = document.querySelector('.form-filter')
         formFilter.classList.add('-open')
         document.body.classList.add('-lock')
      }
   }
}
const searchFooter = document.querySelector('.search-footer')
if (searchFooter) {
   new ValidateForm(searchFooter, {
      method: 'GET',
      url: '',
      items: {
         input: searchFooter.querySelectorAll('input[type="text"].-req'),
      }
   })
}
const searchForm = document.querySelector('.search__row')
if (searchForm) {
   new ValidateForm(searchForm, {
      method: 'GET',
      url: '',
      items: {
         input: searchForm.querySelectorAll('input[type="text"].-req'),
      }
   })
}

const sliderParts = new Swiper('.slider-parts__body', {
   navigation: {
      nextEl: '.slider-parts__arrows .arrows-slider__arrow_next',
      prevEl: '.slider-parts__arrows .arrows-slider__arrow_prev'
   },
   simulateTouch: true,
   grabCursor: true,
   watchOverflow: false,
   freeMode: true,
   spaceBetween: 23,
   breakpoints: {
      0: {
         slidesPerView: 1.5,
         spaceBetween: 18,
      },
      575.98: {
         slidesPerView: 1.5,
         spaceBetween: 18,
      },
      767.98: {
         slidesPerView: 3,
      },
      991.98: {
         slidesPerView: 5,
      },
   }
})
let sliderBest = null
const mqlSliderBest = window.matchMedia('(min-width: 767.98px)')
function mediaHandlerSliderBest(e) {
   if (e.matches) {
      if (!sliderBest) {
         sliderBest = new Swiper('.slider-best__body', {
            navigation: {
               nextEl: '.slider-best__arrows .arrows-slider-big__arrow_next',
               prevEl: '.slider-best__arrows .arrows-slider-big__arrow_prev'
            },
            simulateTouch: true,
            grabCursor: true,
            slidesPerView: 2,
            watchOverflow: false,
            spaceBetween: 30,
         })
      }
   } else {
      if (sliderBest) {
         sliderBest.destroy()
         sliderBest = null
      }
   }
}
if (document.querySelector('.slider-best__body')) {
   mediaHandlerSliderBest(mqlSliderBest)
   mqlSliderBest.addEventListener('change', e => {
      mediaHandlerSliderBest(e)
   })
}

let sliderAds = null
const mqlSliderAds = window.matchMedia('(min-width: 767.98px)')
function mediaHandlerSliderAds(e) {
   if (e.matches) {
      if (!sliderAds) {
         sliderAds = new Swiper('.slider-ads__body', {
            navigation: {
               nextEl: '.slider-ads__arrows .arrows-slider-big__arrow_next',
               prevEl: '.slider-ads__arrows .arrows-slider-big__arrow_prev'
            },
            simulateTouch: true,
            grabCursor: true,
            watchOverflow: false,
            spaceBetween: 30,
         })
      }
   } else {
      if (sliderAds) {
         sliderAds.destroy()
         sliderAds = null
      }
   }
}
if (document.querySelector('.slider-ads__body')) {
   mediaHandlerSliderAds(mqlSliderAds)
   mqlSliderAds.addEventListener('change', e => {
      mediaHandlerSliderAds(e)
   })
}