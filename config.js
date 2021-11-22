const options = {
  mongodb: {
    uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.foboz.mongodb.net/ecommerce?retryWrites=true&w=majority"`,
  },
  firestore: {
    type: "service_account",
    project_id: "proyecto-final-89edb",
    private_key_id: "c09b27f0cb90f7ca4a46637bec79320dfc26dde3",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSVYcLR+//H9lO\nVgAbp85JsErvAFqJ52glaHBYqyT4CaYsUUhAvGwnf2AS9yccXSLSA97jyyIWJbBs\nV3ltsjNLY1QtYQafXgysN6GYYXRI9nFHu2QUgDikNTh+/oKULQwyARDmn/7nLBBk\nFsv5K0vU4rBHlwSHh/9ScRph9EErKu7Gd/KeAUsaMR7i1HbMfNLgiLY42zHI1xrj\nbcRKEh4oLCebnibu16/Ff69rVOppqxonBcn0Ed7WXhznuLeF0fHTq9o8sgzpZyAB\nRA+5X0pIswOBesuGrZb1Y3HQotA9ToP2BKCMjfKA8SNo2f8zYmMvRisqU0FxLsrE\nLwanHDxhAgMBAAECggEAB0TMZMU+KSzCbOoc7oJnPHWwCUATtkCogTkcP3wz9rHC\nq9+9Ovt9U1ocCbEVNBjl4Kh160e0VwaYvmMW1QXRBFHGRsaGcjsk/fidiC9p/jGC\nFa6x/+FfKRGWcRETldJUDGWsCK75If0MWKEkYxPYzDPEpXILG9yaeWYOOYS1kdZw\ncI1ss2MmQW1owp1TH+LPCQ3BYqjLIiuQkyWJO1L+jSaP74yYBBLLu+9F3TJ5hsme\nqjEDxAK6jWAUJ+hzWGdhbh5fi/F4KU5xWdWBaioj2oS4Tqw5dBHfW2dOhpVksl/A\nWBm74gbeCKkr4LADZnjJGwbMBWPbQ8lkNJR5fsUvaQKBgQDwfZmW2GfjwHxNQ8VB\na/ysRnxYZsSAPtpcQv6NmT6+U3u5A+Iqjx4Dk4H8U3+0KgaV5xVkgU78Bu9O2ba5\nphMd8nQGHLRGOja2dhRT8YGv+FmXSU5NgUtwoIheXaQkWIB7dEXe6lsTciQwpXE9\nrQUr0zrigwIiJtptI1n3xywCBQKBgQDf5g5GR32ZsqAhqiCDXU431f+BqWBu2phE\nxcKlO8rkYgE4wfyAUhHSd+ty4AglPsdCuySkGmh4vHwtSUMzozDgojmBYxMIg3Pb\nKqw/nTCMPgLIutrP3G3DPvv5+QXftTSCou4jQ6gF0ycWYnCGxLfg5FqDp4AR3GgS\nbVgq3D6TrQKBgGyQNpKLFLMSxMpYaqay6fiXRTDfC5vdQ9Pchm9Dm7htlW+bGjEe\nNG1m3Ioc44xgYGKxU83wNci+FK/ixoMePokJV2ke8h61ztcljN2sK2BV25PZCtkg\nIf8w6P64hQ3HShDxF02fPAgWQdIYDXvLLIdxLqbsfz0NjxMvn0Ckj/BFAoGAIBjH\nxRVskQMFZ64O2SYgF2sLJNhWJa4alAlRnQRUUqcmC6/rda3ONkDQtPge0tAMGqnf\nV9MdVOmYV5mgE5/6WsmGuuCsEtVdX3bfmIL9Oa2OEp6OzauI5Kt7zdsAF5DPhUa8\nIrwJM0SQ3umfvgInZgr2WtdBSc4x8SpRsFtAcUUCgYEAkNysSFumxjpkkmHHD09t\n8tqm6XCcwtdWgmrWh27MUDwqwBEYxWCJlQoJpJ0C8lsZSoX7PGvUGENc9CSVhW5K\niS8eF8RqCbfqtL9PeRHMPvDWLsDoiUptbYqfO5vLIE34Bzf9VYkMgWZn297w8sQM\nvDZn/WxKqSfYf3LofY1eenw=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-c8e34@proyecto-final-89edb.iam.gserviceaccount.com",
    client_id: "110449685108932839698",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c8e34%40proyecto-final-89edb.iam.gserviceaccount.com",
  },
};

module.exports = options;
