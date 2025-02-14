// import Asset from '../models/Asset.js';

// export const AssetController = {
//   // Get all assets
//   getAssets: async (req, res) => {
//     try {
//       const assets = await Asset.find();
//       res.json(assets);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching assets' });
//     }
//   },

//   // Create a new asset
//   createAsset: async (req, res) => {
//     try {
//       const newAsset = new Asset(req.body);
//       const savedAsset = await newAsset.save();
//       res.status(201).json(savedAsset);
//     } catch (error) {
//       res.status(400).json({ error: 'Error creating asset' });
//     }
//   },

//   // Update an existing asset
//   updateAsset: async (req, res) => {
//     try {
//       const updatedAsset = await Asset.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       res.json(updatedAsset);
//     } catch (error) {
//       res.status(400).json({ error: 'Error updating asset' });
//     }
//   },

//   // Delete an asset
//   deleteAsset: async (req, res) => {
//     try {
//       await Asset.findByIdAndDelete(req.params.id);
//       res.json({ message: 'Asset deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Error deleting asset' });
//     }
//   },

//   // Search for assets by name or category
//   searchAssets: async (req, res) => {
//     try {
//       const { q } = req.query;
//       const assets = await Asset.find({
//         $or: [
//           { name: { $regex: q, $options: 'i' } },
//           { category: { $regex: q, $options: 'i' } }
//         ]
//       });
//       res.json(assets);
//     } catch (error) {
//       res.status(500).json({ error: 'Error searching assets' });
//     }
//   },

//   // Get asset history
//   getAssetHistory: async (req, res) => {
//     try {
//       const assets = await Asset.find().select('name category status history');
//       res.json(assets);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching asset history' });
//     }
//   }
// };
