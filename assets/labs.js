// AI Lab configuration. To add a lab: put the notebook in /notebooks and add an entry below.
//
// Optional per lab:
//   kaggleUrl  link to a public copy you published on Kaggle. The Kaggle button then
//              opens "Copy & Edit", which keeps your GPU setting and attached datasets.
window.AILAB = {
  github: { user: "SaeedSerwan", repo: "ailab", branch: "main" },

  labs: [
    { title: "Setup check", file: "00_setup_check.ipynb", minutes: 5, gpu: false,
      data: "Built-in digits",
      summary: "Check that the GPU and Internet are on, then train a tiny model with no downloads.",
      learn: ["How cells, the kernel and the GPU setting work", "How to tell whether you have a GPU", "A first classifier on 8 × 8 digits"] },
    { title: "MNIST with classical machine learning", file: "01_mnist_classical_ml.ipynb", minutes: 10, gpu: false,
      data: "MNIST",
      summary: "Meet the 70,000 handwritten digits and set a baseline with k-NN and logistic regression.",
      learn: ["Turning images into rows of 784 numbers", "k-nearest neighbours and logistic regression", "Reading a confusion matrix", "Seeing the weights as images"] },
    { title: "A neural network for MNIST", file: "02_mnist_mlp_keras.ipynb", minutes: 10, gpu: true,
      data: "MNIST",
      summary: "Build a multilayer perceptron in Keras, train it and read its learning curves.",
      learn: ["Dense layers, ReLU and softmax", "Cross-entropy loss and the Adam optimizer", "Spotting overfitting from train and validation curves"] },
    { title: "A convolutional network for MNIST", file: "03_mnist_cnn_keras.ipynb", minutes: 15, gpu: true,
      data: "MNIST",
      summary: "Train a CNN past 99% accuracy, then look at its filters and feature maps.",
      learn: ["Convolution and pooling", "Why CNNs need fewer parameters than MLPs on images", "Visualising learned filters and feature maps"] },
    { title: "Fashion-MNIST and data augmentation", file: "04_fashion_mnist_augmentation.ipynb", minutes: 15, gpu: true,
      data: "Fashion-MNIST",
      summary: "A harder dataset of clothing. Add augmentation and batch normalisation, and find the classes the model confuses.",
      learn: ["Augmentation layers", "Batch normalisation and early stopping", "Per-class precision and recall"] },
    { title: "Transfer learning on CIFAR-10", file: "05_cifar10_transfer_learning.ipynb", minutes: 20, gpu: true,
      data: "CIFAR-10",
      summary: "Reuse an ImageNet-trained MobileNetV2 to classify colour photos in minutes.",
      learn: ["Freezing a pretrained backbone", "Training a new classification head", "Fine-tuning with a small learning rate"] },
    { title: "An autoencoder: learning without labels", file: "06_mnist_autoencoder.ipynb", minutes: 15, gpu: true,
      data: "MNIST",
      summary: "Squeeze each digit into two numbers, plot that space next to PCA, and decode new digits from it.",
      learn: ["Encoder and decoder networks", "Comparing a 2-D latent space with PCA", "Generating images from the latent space"] },
    { title: "The same CNN in PyTorch", file: "07_mnist_cnn_pytorch.ipynb", minutes: 15, gpu: true,
      data: "MNIST",
      summary: "Rewrite the lab 3 model in PyTorch and write the GPU training loop yourself.",
      learn: ["nn.Module and the forward pass", "Moving models and tensors to the GPU", "A hand-written training and evaluation loop"] },
  ],
};
