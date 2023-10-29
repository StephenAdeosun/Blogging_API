const db = require('../dbs/inventory.js')
const fs = require('fs')
const path = require('path')

const inventoryPath = path.join(__dirname, '../db/inventory.js')

// save the updated inventory_items array back to the inventory.js file
const writeDb = (db) => {
    const newDbContent = `module.exports = ${JSON.stringify(db, null, 4)};\n`;
    fs.writeFileSync(inventoryPath, newDbContent, 'utf8');
}



// Get All Items
const getAllItems = (req, res) => {
    res.json(db.inventory_items)
}


// Get Item By Id
const getItemById = (req, res) => {
    const id = parseInt(req.params.id)
    const item = db.inventory_items.find(item => item.id === id)
    if (item) {
        res.status(200).json(item)
    } else {
        res.status(404).send('404 Item Not Found')
    }
}


// Add Item
const addItem = (req, res) => {
    const item = req.body
    item.id = db.inventory_items.length + 1
    db.inventory_items.push(item)
    // Write the updated inventory_items array back to the inventory.js file
    writeDb(db)

    res.status(201).send('Item added')
}


// Update Item
const updateItem = (req, res) => {
    const itemId = parseInt(req.params.id)
    itemUpdate = req.body
    const itemIndex = db.inventory_items.findIndex(item => item.id === itemId)

    if (itemIndex !== -1) {
        db.inventory_items[itemIndex] = itemUpdate
        itemUpdate.id = itemId
        // Write the updated inventory_items array back to the inventory.js file
        writeDb(db)
        res.status(200).send('Item updated')

    }
    else {
        res.status(404).send('404 Item Not Found')
    }

}



// Delete Item
const deleteItem = (req, res) => {
    const itemId = parseInt(req.params.id)
    const itemIndex = db.inventory_items.findIndex(item => item.id === itemId)
    if (itemIndex !== -1) {
        db.inventory_items.splice(itemIndex, 1)
        // Write the updated inventory_items array back to the inventory.js file
        writeDb(db)
        res.status(200).send('Item deleted')
    }
    else {
        res.status(404).send('404 Item Not Found')
    }

}


module.exports = {
    getAllItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
}