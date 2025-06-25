import React from 'react';

function ContactPage() {
  return (
    <div className="page-container">
      <h2>Contact Us</h2>
      <p>Have questions or feedback? We'd love to hear from you!</p>
      <div style={{ marginTop: '30px', lineHeight: '1.8' }}>
        <p><strong>Email:</strong> support@myeshop.com</p>
        <p><strong>Phone:</strong> +880 1234 567890</p>
        <p><strong>Address:</strong> 123 E-Shop Lane, Business City, Bangladesh</p>
      </div>
      <form style={{ maxWidth: '600px', margin: '30px auto 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '20px' }}>Send us a message</h3>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Your Name:</label>
          <input type="text" id="name" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Your Email:</label>
          <input type="email" id="email" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
          <textarea id="message" rows="5" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}></textarea>
        </div>
        <button type="submit" style={{
          padding: '12px 25px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1.1em',
        }}>
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactPage;