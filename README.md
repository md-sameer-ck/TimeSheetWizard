# 🕒 TimeSheet Wizard

**Automated timesheet processing and visualization tool with Monday.com & Atlassian integration**

## ✨ Features

- **🔄 Automated Processing**: Converts raw timesheet data into consolidated reports
- **🎯 Smart Ticket Recognition**: Extracts Monday.com IDs and Atlassian tickets from comments
- **📊 Rich Visualizations**: Interactive charts showing hours distribution by employee, task, and ticket source
- **🔐 Secure API Integration**: Server-side credential management via Netlify Functions
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **📈 Real-time Analytics**: Instant statistics and insights from your timesheet data

## 🚀 Quick Start

1. **Visit the App**: Go to [timesheetwizard.netlify.app](https://timesheetwizard.netlify.app/)
2. **Upload File**: Click "Choose Timesheet File" and select your `.xlsx` or consolidated `.csv` file
3. **Process**: Click "🚀 Process & Visualize"
4. **Analyze**: View charts, statistics, and download consolidated reports

## 📋 Supported File Formats

### Input Files
- **Excel Files (.xlsx)**: Raw timesheet exports from Monday.com or similar platforms
- **CSV Files (.csv)**: Must be named with `Consolidated_Report` for visualization-only mode

### Expected Columns
- `Employee Name` / `Name` / `Worker`
- `Task` / `Task Type` / `Activity`
- `Total Hours` / `Hours` / `Duration`
- `Comments` / `Description` / `Notes`
- `Task Billing Type` (optional - filters for "Billable" entries)

## 🎯 Ticket Recognition

The system automatically extracts and processes:

- **Monday.com Items**: 
  - 10-digit numeric IDs (e.g., `2542511835`)
  - TBUS format IDs (e.g., `TBUS-144`, `TBUS-1000`)
- **Atlassian Tickets**: OPS format (e.g., `OPS-123`, `OPS 456`)

Extracted tickets are enriched with:
- **Monday.com**: 
  - Numeric IDs: Item names and story points from main board
  - TBUS IDs: Item names and story points from board 5088989923
- **Atlassian**: Ticket summaries and status

### Ticket ID Detection Logic

The application uses regex patterns to identify tickets:

- **Numeric Monday.com IDs**: `/\b\d{10}\b/g` - Matches exactly 10 consecutive digits
- **TBUS Tickets**: `/TBUS-\d+/gi` - Matches TBUS followed by hyphen and any number of digits
- **OPS Tickets**: `/OPS\D*(\d+)/gi` - Matches OPS followed by optional non-digits and numbers

**Dual Board Support**: 
- Numeric IDs query the default Monday.com board using direct item lookup
- TBUS IDs query board 5088989923 using column value search on the `item_id` column

## 📊 Generated Outputs

### Visualizations
- **Employee Hours Distribution**: Bar/Pie/Doughnut charts
- **Task Type Breakdown**: Hours by activity type
- **Ticket Source Analysis**: Monday.com vs Atlassian vs Manual
- **Top Tickets**: Highest hour consumers

### Reports
- **Consolidated CSV**: Processed data with ticket information
- **JSON Export**: Raw data with processing metadata
- **Interactive Table**: Top 50 entries with search/sort

## 🛠️ Technical Architecture

### Frontend
- **Pure HTML/CSS/JS**: No framework dependencies
- **Chart.js**: Interactive data visualizations
- **PapaParse**: CSV processing
- **SheetJS**: Excel file parsing

### Backend (Netlify Functions)
- **Monday.com Integration**: GraphQL API for item details
- **Atlassian Integration**: REST API for ticket information
- **Secure Credentials**: Environment variable storage
- **CORS Handling**: Cross-origin request management

## 🔐 Security & Privacy

- **No Client-side Credentials**: All API keys stored securely on server
- **No Data Storage**: Files processed in-memory only
- **HTTPS Only**: Encrypted data transmission
- **No Tracking**: No analytics or user data collection

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- Netlify CLI (for local development)

### Local Development
```bash
# Clone repository
git clone https://github.com/md-sameer-ck/TimeSheetWizard.git
cd TimeSheetWizard

# Install Netlify CLI
npm install -g netlify-cli

# Set up environment variables
# Create .env file with:
# MONDAY_API_KEY=your_monday_api_key
# ATLASSIAN_DOMAIN=your-domain.atlassian.net
# ATLASSIAN_EMAIL=your-email@domain.com
# ATLASSIAN_TOKEN=your_atlassian_token

# Start development server
netlify dev
```

### Environment Variables
Configure these in Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONDAY_API_KEY` | Monday.com API token | `eyJhbGciOiJ...` |
| `ATLASSIAN_DOMAIN` | Atlassian instance domain | `company.atlassian.net` |
| `ATLASSIAN_EMAIL` | Atlassian account email | `user@company.com` |
| `ATLASSIAN_TOKEN` | Atlassian API token | `ATATT3xFfGF0...` |

## 📁 Project Structure

```
TimeSheetWizard/
├── index.html              # Main application
├── netlify.toml            # Netlify configuration
├── netlify/
│   └── functions/
│       ├── monday.js       # Monday.com API integration
│       └── atlassian.js    # Atlassian API integration
└── README.md               # Documentation
```

## 🔄 Data Processing Flow

1. **File Upload**: User selects Excel or CSV file
2. **Column Normalization**: Maps various column names to standard format
3. **Data Filtering**: Removes non-billable entries
4. **Ticket Extraction**: Regex parsing for Monday.com IDs (numeric and TBUS format) and OPS tickets
5. **API Enrichment**: Fetches ticket details from respective APIs
6. **Consolidation**: Groups entries by ticket and calculates totals
7. **Visualization**: Generates charts and statistics
8. **Export**: Provides downloadable reports

## 🎨 Customization

### Chart Types
- Bar Charts (default)
- Pie Charts
- Doughnut Charts

### Color Schemes
Predefined 15-color palette with automatic cycling for large datasets.

### Responsive Breakpoints
- Desktop: 1400px max-width
- Tablet: 768px breakpoint
- Mobile: Optimized layouts

## 🐛 Troubleshooting

### Common Issues

**File Processing Errors**
- Ensure file contains required columns
- Check for billable entries only
- Verify Excel files start data from row 3

**API Integration Issues**
- Confirm environment variables are set
- Check API token permissions
- Verify domain format (no https://)

**Missing Visualizations**
- Ensure processed data contains valid entries
- Check browser console for errors
- Try different chart types

## 📈 Performance

- **File Size**: Handles up to 10MB Excel files
- **Processing Speed**: ~1000 records/second
- **API Limits**: Respects Monday.com and Atlassian rate limits
- **Browser Compatibility**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request


## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/md-sameer-ck/TimeSheetWizard/issues)
- **Email**: [md.sameer@cloudkaptan.com](mailto:md.sameer@cloudkaptan.com)
- **Documentation**: This README and inline code comments

---

**Made with ❤️ by [Md Sameer](https://github.com/md-sameer-ck)**
