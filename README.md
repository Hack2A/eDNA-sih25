# 🌊 eDNA Deep-Sea Biodiversity AI Pipeline 🧬🤖

## 🚀 Project Overview

The deep ocean—covering abyssal plains, hydrothermal vents, and seamounts—holds a vast, mysterious biodiversity. Much of this life remains undiscovered due to the ocean’s inaccessibility. Understanding deep-sea biodiversity is crucial for:
- 🌱 Revealing ecological interactions (food webs, nutrient cycling)
- 🛡️ Informing conservation strategies for vulnerable habitats
- 🧪 Discovering novel eukaryotic species with biotechnological/ecological significance

## 🧬 What is eDNA?

Environmental DNA (eDNA) is a non-invasive technique that captures genetic traces from environmental samples (like seawater or sediment), allowing scientists to study marine life **without disturbing fragile habitats**. By targeting marker genes (18S rRNA, COI), eDNA reveals the diversity of eukaryotic taxa—including rare and novel species.

## 🏢 Project Description

The Centre for Marine Living Resources and Ecology (CMLRE) will:
- 🚢 Conduct deep-sea voyages to collect sediment and water samples from biodiversity hotspots
- 🧪 Extract eDNA from these samples
- 🧬 Perform high-throughput sequencing for biodiversity assessment and ecosystem monitoring

## ⚠️ The Challenge

Assigning raw eDNA reads to eukaryotic taxa is **difficult** because:
- 📚 Reference databases (SILVA, PR2, NCBI) lack deep-sea organism sequences
- 🧩 Traditional pipelines (QIIME2, DADA2, mothur) rely on these incomplete databases
- 🕒 Computational time is high, and many reads remain unclassified or misclassified

## 💡 Our Solution

We propose an **AI-driven pipeline** that:
- 🤖 Uses deep learning and unsupervised learning to classify eukaryotic taxa directly from raw eDNA reads
- 🏷️ Annotates sequences and estimates abundance
- 🚫 Minimizes reliance on reference databases
- ⚡ Reduces computational time with optimized workflows
- 🌟 Enables discovery of novel taxa and ecological insights in deep-sea ecosystems

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Hack2A/eDNA-sih25
cd eDNA-sih25
```

### 2. Install Python Dependencies

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server` directory and add required variables (e.g., database URI, SerpAPI key):

```
SQLALCHEMY_DATABASE_URI=your_database_uri
JWT_SECRET_KEY=your_jwt_secret
SERPAPI_KEY=your_serpapi_key
```

### 4. Initialize the Database

```bash
python
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
...     db.create_all()
... 
```

### 5. Run the Server

```bash
python run.py
```
### 6. Frontend Setup

```
cd ../frontend
npm install
npm run dev
```
Your frontend will be available on http://localhost:5173

### 7. API Usage

- **POST /api/predict**: Submit eDNA sequence data for classification
- **GET /api/history**: Retrieve previous results by user
- **GET /api/latest-result**: Get the latest research result for the user

---

## 📚 Technologies Used

- Python, Flask, SQLAlchemy
- Deep Learning (custom pipeline)
- JWT Authentication
- RESTful APIs

---

## 🤝 Contributing

Feel free to open issues or submit pull requests!  
For questions, contact the maintainers.

---

## 🐳 License

MIT License

---

## 🌐 Acknowledgements

Developed for the Centre for Marine Living Resources and Ecology (CMLRE)  
Empowering deep-sea biodiversity research with AI!