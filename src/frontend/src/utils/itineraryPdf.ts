import type { Itinerary } from '../backend';

export async function generateItineraryPDF(itinerary: Itinerary): Promise<void> {
  if (!itinerary) {
    throw new Error('Itinerary data is required to generate PDF');
  }

  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.');
    }

    // Build the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Cruise Itinerary - ${itinerary.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header {
              background: linear-gradient(135deg, #006699 0%, #0099cc 100%);
              color: white;
              padding: 30px 20px;
              margin: -20px -20px 30px -20px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 32px;
              margin-bottom: 5px;
            }
            
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #006699;
              margin-bottom: 12px;
              padding-bottom: 5px;
              border-bottom: 2px solid #006699;
            }
            
            .dates-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .date-box {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 5px;
              background: #f9f9f9;
            }
            
            .date-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .date-value {
              font-size: 18px;
              font-weight: bold;
              color: #006699;
            }
            
            .port-list {
              list-style: none;
              padding-left: 0;
            }
            
            .port-item {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
            }
            
            .port-number {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              background: #006699;
              color: white;
              border-radius: 50%;
              font-weight: bold;
              margin-right: 12px;
              flex-shrink: 0;
            }
            
            .cabin-grid {
              display: grid;
              gap: 15px;
            }
            
            .cabin-card {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 5px;
              background: #f9f9f9;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .cabin-info h4 {
              font-size: 16px;
              margin-bottom: 5px;
            }
            
            .cabin-availability {
              font-size: 13px;
              color: #666;
            }
            
            .cabin-price {
              text-align: right;
            }
            
            .price-amount {
              font-size: 24px;
              font-weight: bold;
              color: #ff6b35;
            }
            
            .price-label {
              font-size: 11px;
              color: #666;
            }
            
            .list-items {
              list-style: none;
              padding-left: 0;
            }
            
            .list-items li {
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
            }
            
            .list-items li:before {
              content: "•";
              position: absolute;
              left: 5px;
              color: #006699;
              font-weight: bold;
            }
            
            .amenities {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            
            .amenity-badge {
              background: #e6f2ff;
              color: #006699;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 13px;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            
            .contact-info {
              background: #e6f2ff;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
              margin-top: 30px;
            }
            
            .contact-info h3 {
              color: #006699;
              margin-bottom: 10px;
            }
            
            .phone {
              font-size: 20px;
              font-weight: bold;
              color: #006699;
            }
            
            @media print {
              body {
                padding: 10px;
              }
              
              .header {
                margin: -10px -10px 20px -10px;
              }
              
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cruise Itinerary</h1>
            <p>Next Time Vacations</p>
          </div>
          
          <div class="dates-grid">
            <div class="date-box">
              <div class="date-label">Departure Date</div>
              <div class="date-value">${itinerary.departureDate}</div>
            </div>
            <div class="date-box">
              <div class="date-label">Return Date</div>
              <div class="date-value">${itinerary.returnDate}</div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Ports of Call</h2>
            <ul class="port-list">
              ${itinerary.portsOfCall.map((port, idx) => `
                <li class="port-item">
                  <span class="port-number">${idx + 1}</span>
                  <span>${port}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h2 class="section-title">Ship Specifications</h2>
            <p>${itinerary.shipSpecs}</p>
          </div>
          
          ${itinerary.cabins && itinerary.cabins.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Cabin Categories & Pricing</h2>
              <div class="cabin-grid">
                ${itinerary.cabins.map(cabin => `
                  <div class="cabin-card">
                    <div class="cabin-info">
                      <h4>${cabin.category}</h4>
                      <div class="cabin-availability">${Number(cabin.availability)} cabins available</div>
                    </div>
                    <div class="cabin-price">
                      <div class="price-amount">$${Number(cabin.price).toLocaleString()}</div>
                      <div class="price-label">per person</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${itinerary.diningOptions && itinerary.diningOptions.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Dining Options</h2>
              <ul class="list-items">
                ${itinerary.diningOptions.map(option => `<li>${option}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${itinerary.entertainment && itinerary.entertainment.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Entertainment & Activities</h2>
              <ul class="list-items">
                ${itinerary.entertainment.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${itinerary.amenities && itinerary.amenities.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Ship Amenities</h2>
              <div class="amenities">
                ${itinerary.amenities.map(amenity => `<span class="amenity-badge">${amenity}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="contact-info">
            <h3>Interested in booking this cruise?</h3>
            <p>Contact Next Time Vacations to reserve your spot!</p>
            <p class="phone">📞 434-238-8796</p>
          </div>
          
          <div class="footer">
            <p>Next Time Vacations | 434-238-8796</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 250);
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}
