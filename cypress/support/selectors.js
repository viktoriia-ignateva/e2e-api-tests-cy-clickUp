// Header
export const addButtonSel = 'button[data-test="quick-create-modal-toggle-new-task"]'

// Side menu
export const spaceSel = (spaceName) => `[data-test="project-row__name__${spaceName}"]`
export const listSel = (listName) => `[data-test="subcategory-row__${listName}"]`

// Bar Controller
export const barControllerSel = '[data-test="views-bar__controller-row"]'
export const addNewTaskButtonSel = '[data-test="create-task-menu__new-task-button"]'

// Task Model
export const taskSel = (taskName) => `[data-test="task-row-main__${taskName}"]`
export const taskIdButtonSel = '[data-test="task-view-task-label__taskid-button"]'
export const taskTitleSel = '[data-test="task-title__title-overlay"]'
export const priorityLabelSel = (priorityLabel) => `[data-test="priorities-view__item-label-${priorityLabel}"]`
export const taskDescriptionSel = '[data-test="task-editor"] > div > div'
export const tagSel = (tagName) => `[data-test="tags-select__name-shadow-${tagName}"]`

// Task Creating Model
export const creatingTaskModelSel = '[data-test="modal__body]"]'
export const newTaskTitleInputSel= '[data-test="draft-view__title-task"]'
export const createNewTaskButtonSel= '[data-test="draft-view__quick-create-create"]'
export const taskNameErrorSel = '[data-pendo="quick-create-task-enter-task-name-error"]'
export const selectListDropdownSel = '[data-test="hierarchy-picker__menu"]'