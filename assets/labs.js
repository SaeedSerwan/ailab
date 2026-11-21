// ============================================================
//  AI Lab configuration: the ONLY file you edit to add labs.
// ============================================================
window.AILAB = {
  github: { user: "SaeedSerwan", repo: "ailab", branch: "main" },

  // Each lab = one notebook in /notebooks.
  // Optional  kaggleUrl: link to a public copy you published on Kaggle.
  //   When set, the main button becomes "Copy & Edit on Kaggle" (most reliable:
  //   GPU setting and attached datasets travel with the copy).
  labs: [
    { id: "00", title: "Kaggle Setup Check", file: "00_kaggle_setup_check.ipynb",
      level: "Start here", minutes: 5, accel: "CPU", dataset: "sklearn digits (built-in)",
      topics: ["Kaggle basics", "GPU & Internet check"],
      blurb: "Confirms your account, GPU and Internet are ready, then trains a first tiny model with no downloads." },
    { id: "01", title: "MNIST with Classical ML", file: "01_mnist_classical_ml.ipynb",
      level: "Beginner", minutes: 10, accel: "CPU", dataset: "MNIST",
      topics: ["k-NN", "Logistic regression", "Confusion matrix"],
      blurb: "Meet the 70,000 handwritten digits and set a baseline with scikit-learn before any neural network." },
    { id: "02", title: "MNIST Neural Network (MLP)", file: "02_mnist_mlp_keras.ipynb",
      level: "Beginner", minutes: 10, accel: "GPU", dataset: "MNIST",
      topics: ["Keras", "Softmax", "Overfitting"],
      blurb: "Build and train a multilayer perceptron in Keras and read its learning curves." },
    { id: "03", title: "MNIST Convolutional Network", file: "03_mnist_cnn_keras.ipynb",
      level: "Intermediate", minutes: 15, accel: "GPU", dataset: "MNIST",
      topics: ["Conv2D", "Pooling", "Feature maps"],
      blurb: "Train a CNN past 99% accuracy and look inside its filters and feature maps." },
    { id: "04", title: "Fashion-MNIST & Augmentation", file: "04_fashion_mnist_augmentation.ipynb",
      level: "Intermediate", minutes: 15, accel: "GPU", dataset: "Fashion-MNIST",
      topics: ["Augmentation", "BatchNorm", "Early stopping"],
      blurb: "A harder dataset of clothing images. Add augmentation, regularise, and find which classes confuse the model." },
    { id: "05", title: "CIFAR-10 Transfer Learning", file: "05_cifar10_transfer_learning.ipynb",
      level: "Advanced", minutes: 20, accel: "GPU", dataset: "CIFAR-10",
      topics: ["MobileNetV2", "Feature extraction", "Fine-tuning"],
      blurb: "Reuse an ImageNet-trained network to classify colour photos in minutes rather than hours." },
    { id: "06", title: "Autoencoder (Unsupervised)", file: "06_mnist_autoencoder.ipynb",
      level: "Intermediate", minutes: 15, accel: "GPU", dataset: "MNIST",
      topics: ["Latent space", "PCA vs AE", "Generation"],
      blurb: "Compress each digit to two numbers without labels, plot the latent space and generate new digits." },
    { id: "07", title: "MNIST CNN in PyTorch", file: "07_mnist_cnn_pytorch.ipynb",
      level: "Intermediate", minutes: 15, accel: "GPU", dataset: "MNIST (torchvision)",
      topics: ["PyTorch", "CUDA", "Training loop"],
      blurb: "The Lab 03 model again, this time writing the GPU training loop yourself in PyTorch." },
  ],
};
