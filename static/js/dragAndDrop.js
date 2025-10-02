// Fully responsive drag-and-drop system
// *******************************************
class DragDropSystem {
  constructor() {
    this.dragElements = [];
    this.targetElements = [];
    this.isDragging = false;
    this.currentDragElement = null;
    this.currentTargetPoint = null;
    this.originPosition = null;
  }

  // Initialization with provided IDs
  init(dragElementIds, targetElementIds) {
    this.initDragElements(dragElementIds);
    this.initTargetElements(targetElementIds);
    this.setupEventListeners();
    console.log(
      `Initialized ${this.dragElements.length} drag elements and ${this.targetElements.length} target elements`
    );
  }

  // Initialization Drag Elements
  initDragElements(dragElementIds) {
    dragElementIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        this.dragElements.push({
          element,
          id,
          isOver: false,
          isHeld: false,
        });
      } else {
        console.warn(`Drag element with id "${id}" not found`);
      }
    });
  }

  // Initialization Target Elements
  initTargetElements(targetElementIds) {
    targetElementIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        this.targetElements.push({
          element,
          id,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        console.warn(`Target element with id "${id}" not found`);
      }
    });
  }

  // Add a new drag element dynamically
  addDragElement(element, id) {
    const dragItem = {
      element,
      id: id || `drag_${Date.now()}`,
      isOver: false,
      isHeld: false,
    };

    this.dragElements.push(dragItem);
    this.setupDragElementEvents(dragItem);
    console.log(`Added drag element: ${dragItem.id}`);
  }

  // Setup event listeners for all drag elements
  setupEventListeners() {
    this.dragElements.forEach((dragItem) => {
      this.setupDragElementEvents(dragItem);
    });

    // Resize event
    window.addEventListener("resize", () => this.updateTargetCoordinates());
  }

  setupDragElementEvents(dragItem) {
    const { element, id } = dragItem;
    console.log("Setting up drag events for:", id);

    // Mouse events
    // element.addEventListener("mouseover", () => this.onDragStart(dragItem));
    // element.addEventListener("mouseout", () => this.onDragEnd(dragItem));
    element.addEventListener("mousedown", (e) => this.onMouseDown(e, dragItem));
    element.addEventListener("mouseup", (e) => this.onMouseUp(e, dragItem));
    element.addEventListener("mousemove", (e) => this.onMouseMove(e, dragItem));

    // Touch events
    element.addEventListener("touchstart", (e) =>
      this.onTouchStart(e, dragItem)
    );
    element.addEventListener("touchend", (e) => this.onTouchEnd(e, dragItem));
    element.addEventListener("touchmove", (e) => this.onTouchMove(e, dragItem));
  }

  // Event handlers
  onDragStart(dragItem) {
    dragItem.isOver = true;
    this.checkDragCondition(dragItem);
  }

  onDragEnd(dragItem) {
    dragItem.isOver = false;
    this.checkDragCondition(dragItem);
  }

  onMouseDown(event, dragItem) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragItem.isOver = true;
    dragItem.isHeld = true;
    this.currentDragElement = dragItem;
    this.saveOriginPosition(dragItem);
    this.checkDragCondition(dragItem);

    document.addEventListener("mousemove", this.handleGlobalMouseMove);
    document.addEventListener("mouseup", this.handleGlobalMouseUp);
  }

  handleGlobalMouseMove = (event) => {
    if (this.isDragging && this.currentDragElement) {
      this.moveDragElement(
        event.clientX,
        event.clientY,
        this.currentDragElement
      );
    }
  };

  handleGlobalMouseUp = (event) => {
    if (this.currentDragElement) {
      this.currentDragElement.isHeld = false;
      this.currentDragElement.isOver = false;
      this.checkDragCondition(this.currentDragElement);
      this.currentDragElement = null;
    }

    document.removeEventListener("mousemove", this.handleGlobalMouseMove);
    document.removeEventListener("mouseup", this.handleGlobalMouseUp);
  };

  onMouseUp(event, dragItem) {
    if (event.button !== 0) return;
    dragItem.isHeld = false;
    this.checkDragCondition(dragItem);
  }

  onMouseMove(event, dragItem) {
    if (!this.isDragging || this.currentDragElement !== dragItem) return;
    this.moveDragElement(event.clientX, event.clientY, dragItem);
  }

  onTouchStart(event, dragItem) {
    event.preventDefault();
    dragItem.isOver = true;
    dragItem.isHeld = true;
    this.currentDragElement = dragItem;
    this.saveOriginPosition(dragItem);
    this.checkDragCondition(dragItem);
  }

  onTouchEnd(event, dragItem) {
    event.preventDefault();
    dragItem.isOver = false;
    dragItem.isHeld = false;
    this.checkDragCondition(dragItem);
  }

  onTouchMove(event, dragItem) {
    if (!this.isDragging || this.currentDragElement !== dragItem) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.moveDragElement(touch.clientX, touch.clientY, dragItem);
  }

  // Core logic
  checkDragCondition(dragItem) {
    if (dragItem.isOver && dragItem.isHeld) {
      this.isDragging = true;
      console.log(`Dragging ${dragItem.id}`);
    } else {
      this.isDragging = false;
      const nearestTarget = this.findNearestTarget(dragItem);
      if (nearestTarget) {
        this.snapToTarget(dragItem, nearestTarget);
        this.updateOriginPosition(dragItem);
      } else {
        this.returnToOrigin(dragItem);
      }
    }
  }

  moveDragElement(clientX, clientY, dragItem) {
    const rect = dragItem.element.getBoundingClientRect();
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    dragItem.element.style.position = "fixed";
    dragItem.element.style.left = clientX - offsetX + "px";
    dragItem.element.style.top = clientY - offsetY + "px";
    dragItem.element.style.zIndex = "1000";
    dragItem.element.style.pointerEvents = "none";
  }

  findNearestTarget(dragItem, threshold = 50) {
    const dragRect = dragItem.element.getBoundingClientRect();
    const dragCenterX = dragRect.left + dragRect.width / 2;
    const dragCenterY = dragRect.top + dragRect.height / 2;

    for (let target of this.targetElements) {
      const rect = target.element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(dragCenterX - targetX, 2) + Math.pow(dragCenterY - targetY, 2)
      );

      if (distance <= threshold) {
        return target;
      }
    }
    return null;
  }

  snapToTarget(dragItem, target) {
    console.log(`Snapping ${dragItem.id} to ${target.id}`);

    target.element.appendChild(dragItem.element);

    dragItem.element.style.position = "";
    dragItem.element.style.left = "";
    dragItem.element.style.top = "";
    dragItem.element.style.zIndex = "";
    dragItem.element.style.pointerEvents = "";

    this.updateCardArrays(dragItem, target.id);
  }

  updateCardArrays(dragItem, targetId) {
    if (typeof window.updateCardArraysAfterDrop === "function") {
      window.updateCardArraysAfterDrop(dragItem.element, targetId);
    }
  }

  saveOriginPosition(dragItem) {
    if (
      !this.originPosition ||
      this.originPosition.element !== dragItem.element
    ) {
      const rect = dragItem.element.getBoundingClientRect();
      const style = window.getComputedStyle(dragItem.element);
      this.originPosition = {
        element: dragItem.element,
        left: style.left === "auto" ? rect.left : parseFloat(style.left),
        top: style.top === "auto" ? rect.top : parseFloat(style.top),
        position: style.position,
      };
    }
  }

  // Update origin position after successful drop
  updateOriginPosition(dragItem) {
    const rect = dragItem.element.getBoundingClientRect();
    const style = window.getComputedStyle(dragItem.element);

    this.originPosition = {
      element: dragItem.element,
      left: parseFloat(style.left) || rect.left,
      top: parseFloat(style.top) || rect.top,
      position: style.position,
    };

    console.log(`Origin position updated for ${dragItem.id} to new location`);
  }

  // Reset to original position if no target is nearby
  returnToOrigin(dragItem) {
    if (
      this.originPosition &&
      this.originPosition.element === dragItem.element
    ) {
      dragItem.element.classList.add("returning_to_origin");

      const parent = dragItem.element.parentElement;
      if (parent) {
        parent.appendChild(dragItem.element);
      }

      dragItem.element.style.position = "";
      dragItem.element.style.left = "";
      dragItem.element.style.top = "";
      dragItem.element.style.zIndex = "";
      dragItem.element.style.pointerEvents = "";

      setTimeout(() => {
        dragItem.element.classList.remove("returning_to_origin");
      }, 400);

      console.log(`${dragItem.id} returned to origin`);
    }
  }

  // Optional: Clear origin position if needed
  clearOriginPosition(dragItem) {
    if (
      this.originPosition &&
      this.originPosition.element === dragItem.element
    ) {
      this.originPosition = null;
      console.log(`Origin position cleared for ${dragItem.id}`);
    }
  }

  updateTargetCoordinates() {
    this.targetElements.forEach((target) => {
      const rect = target.element.getBoundingClientRect();
      target.x = rect.left + rect.width / 2;
      target.y = rect.top + rect.height / 2;
    });
  }
}

// Using the system
// *******************************************
// const dragDropSystem = new DragDropSystem();

// Initialization with provided IDs
// Example
// dragDropSystem.init(
//   ["cardDad"], // IDs of elements for drag
//   ["targetPosition1", "targetPosition2", "targetPositionContainer"] // IDs of target zones
// );
// *******************************************

export default DragDropSystem;
