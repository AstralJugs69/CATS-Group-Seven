# Coffee Supply Chain API

## Overview

The Coffee Supply Chain API provides a comprehensive solution for tracking and managing coffee throughout its journey from farm to cup. This API enables stakeholders to record, verify, and trace coffee beans through various stages of the supply chain, ensuring transparency and quality control.

Throughout the process feel free to use my `secretSeed`, `blockfrostKey`, and `cborHexy`.

## Getting Started

To use this API, you'll need:

1. Valid authentication credentials (API key)
2. Access to the appropriate blockchain network
3. Proper permissions for supply chain operations

## Current Implementation

### Minting Functionality

The API currently supports **minting** operations, which allow you to register and tokenize harvested coffee batches on the blockchain. This creates an immutable record of the coffee's origin and initial harvest data.

#### Register Batch

<Note>
This endpoint registers a new coffee batch and creates its digital identity.
</Note>

**Endpoint:** `POST /mint`

### Request Body

```json
{
  "blockfrostKey": "preprod2LaUuRkKafgzxoHHMuUTEnQOf5hmd4Z0",
  "secretSeed": "cabin family silk spring chalk noble purse riot spend actual indicate age simple broom fame wreck fan relax love shallow bird much invite trumpet",
  "tokenName": "Coffee#3350",
  "metadata": {
    "name": "Coffee batch 33501",
    "weight": "30",
    "unit": "kg",
    "variety": "Sidama",
    "location": "GPS Coordinates",
    "lat": "5.8500° N",
    "long": "39.0500° E",
    "region": "Guji"
  },
  "cborHex": "58d301010022229800aba2aba1aab9faab9eaab9dab9a9bae0049bad0039bae00248888888896600264646644b30013370e900018049baa0018cc004dd7180618051baa001acc004cdc3a400060126ea800a2b3001300a3754005149a2c805a2c804244b30010018a508acc004c96600266e3cdd7180798069baa00100a899b87375a601e6020601a6ea8004026294100b180718061baa300e0018a518998010011807800a0144034911198008009bac300f300d3754601e00e8b2010300a001300a300b001300a00130063754015149a26cac8021"
}
```

### Response (200 OK)

```json
{
    "status": "success",
    "txHash": "f9f33375a4f85d57a4d6a12988b74571f9072060af17df3241c908350137ec94",
    "unit": "dc350cb196a54084318fa489128938025e3b1ad81295227056c30c50436f666665652333333530",
    "policyId": "dc350cb196a54084318fa489128938025e3b1ad81295227056c30c50"
}
```

## Upcoming Features

This is a **work-in-progress API** with additional endpoints currently under development. The following features will be added soon:

### Supply Chain Operations

- **Transfer to Washer** - Record the movement of harvested coffee to washing stations
- **Transport Management** - Track coffee shipments between locations
- **Processing Stages** - Document drying, milling, and roasting operations
- **Quality Control** - Log quality assessments and certifications
- **Distribution Tracking** - Monitor coffee distribution to retailers and consumers

## Status & Updates

This API is actively being developed. New endpoints and features will be added incrementally. Check back regularly for updates, or contact the development team for information about upcoming releases.
