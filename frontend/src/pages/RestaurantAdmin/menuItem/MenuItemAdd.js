import { useState } from "react"
import "./MenuItemAdd.css"

function MenuItemAdd() {

  return (
    <div className="menu-item-add-container">
      <div className="menu-item-add-header">
        <h2>Add New Menu Item</h2>
        <p>Create a new dish for your restaurant menu</p>
      </div>

      <form className="menu-item-form">
        <div className="form-layout">
          <div className="form-main">
            <div className="form-groupM">
              <label className="labelM" htmlFor="name">Item Name</label>
              <input className="inputM"
                type="text"
                id="name"
                name="name"
                placeholder="Enter menu item name"
                required
              />
            </div>

            <div className="form-groupM">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the dish, ingredients, etc."
                rows="4"
                required
              />
            </div>

            <div className="form-rowM">
              <div className="form-groupM">
                <label htmlFor="price">Price</label>
                <input className="labelM"
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input type="checkbox" name="availability" />
                <span className="checkmark"></span>
                <span>Available for ordering</span>
              </label>
            </div>
          </div>

          <div className="form-sidebar">
            <div className="image-upload-container">
              <label htmlFor="image">Item Image</label>
              <div className="image-preview" >

              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="file-input"
              />
              <label htmlFor="image" className="file-input-label">
                Choose Image
              </label>
              <p className="image-help-text">Recommended: 800x600px, JPG or PNG</p>
            </div>
          </div>
        </div>

        <div className="form-actions">

          <button type="submit" className="btn-submit">
            Add Menu Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default MenuItemAdd

