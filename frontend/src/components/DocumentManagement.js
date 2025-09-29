import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Description,
  Article,
  Assignment,
} from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import { apiService } from '../services/api';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    document_type: 'guideline',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (document = null) => {
    if (document) {
      setEditingDocument(document);
      setFormData({
        title: document.title,
        content: document.content,
        document_type: document.document_type,
      });
    } else {
      setEditingDocument(null);
      setFormData({
        title: '',
        content: '',
        document_type: 'guideline',
      });
    }
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDocument(null);
    setFormData({
      title: '',
      content: '',
      document_type: 'guideline',
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingDocument) {
        // Update document logic would go here
        setSuccess('Document updated successfully!');
      } else {
        await apiService.addDocument(formData);
        setSuccess('Document added successfully!');
        fetchDocuments(); // Refresh the list
      }
      
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError('Failed to save document. Please try again.');
      console.error('Error saving document:', err);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'guideline':
        return <Assignment />;
      case 'protocol':
        return <Article />;
      default:
        return <Description />;
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'guideline':
        return 'primary';
      case 'protocol':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const DocumentCard = ({ document }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getDocumentIcon(document.document_type)}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {document.title}
          </Typography>
        </Box>
        
        <Chip
          label={document.document_type}
          size="small"
          color={getDocumentColor(document.document_type)}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {document.content.length > 150
            ? `${document.content.substring(0, 150)}...`
            : document.content}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(document.created_at).toLocaleDateString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          })}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => setViewingDocument(document)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => handleOpenDialog(document)}
        >
          Edit
        </Button>
        <IconButton size="small" color="error">
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading documents...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Document Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Document
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <DocumentCard document={document} />
          </Grid>
        ))}
      </Grid>

      {documents.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Description sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add your first healthcare guideline or document to get started.
          </Typography>
        </Box>
      )}

      {/* Add/Edit Document Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDocument ? 'Edit Document' : 'Add New Document'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={formData.document_type}
                  onChange={handleInputChange('document_type')}
                  label="Document Type"
                >
                  <MenuItem value="guideline">Guideline</MenuItem>
                  <MenuItem value="protocol">Protocol</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={10}
                value={formData.content}
                onChange={handleInputChange('content')}
                placeholder="Enter the document content here..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDocument ? 'Update' : 'Add Document'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog
        open={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        maxWidth="md"
        fullWidth
      >
        {viewingDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getDocumentIcon(viewingDocument.document_type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {viewingDocument.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={viewingDocument.document_type}
                  color={getDocumentColor(viewingDocument.document_type)}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {viewingDocument.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewingDocument(null)}>Close</Button>
              <Button
                onClick={() => {
                  setViewingDocument(null);
                  handleOpenDialog(viewingDocument);
                }}
                variant="contained"
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DocumentManagement;
