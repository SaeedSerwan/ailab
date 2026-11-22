# AI Lab: Kaggle-powered deep learning labs

Interactive AI labs for the College of Computer Studies, University of Technology Bahrain.
The website is hosted on **GitHub Pages**. Each notebook opens in one click on **Kaggle** (about 30 GPU
hours a week per student, T4 x2 or P100) or **Google Colab** (one T4 when available). Students pick the
platform with a switch on the page.

| # | Lab | Data | Accelerator |
|---|-----|------|-------------|
| 0 | Setup check | sklearn digits | CPU |
| 1 | MNIST with classical ML | MNIST | CPU |
| 2 | MNIST MLP (Keras) | MNIST | GPU |
| 3 | MNIST CNN (Keras) | MNIST | GPU |
| 4 | Fashion-MNIST + augmentation | Fashion-MNIST | GPU |
| 5 | CIFAR-10 transfer learning | CIFAR-10 | GPU |
| 6 | Autoencoder (unsupervised) | MNIST | GPU |
| 7 | MNIST CNN in PyTorch | MNIST | GPU |

## Deploy (once)

1. Create the GitHub repo `SaeedSerwan/ailab` (public) and push this folder to `main`.
2. Repo **Settings → Pages → Deploy from a branch → `main` / root**.
3. The site is live at `https://saeedserwan.github.io/ailab/`.
4. If you use a different user, repo or branch, change it in `assets/labs.js`.

## How the open buttons work

```
Kaggle: https://www.kaggle.com/kernels/welcome?src=https://github.com/<user>/<repo>/blob/<branch>/notebooks/<file>.ipynb
Colab:  https://colab.research.google.com/github/<user>/<repo>/blob/<branch>/notebooks/<file>.ipynb
```

Both import the notebook from GitHub into the student's own account. Each notebook then:

* detects whether it runs on Kaggle or Colab and checks for a GPU;
* downloads its dataset through `keras.datasets` / `torchvision` (needs *Settings → Internet → On*),
  falling back to a copy attached with **+ Add Input**;
* writes models and files to `/kaggle/working` (Kaggle) or `/content` (Colab).

**Even more reliable (optional):** publish each notebook on Kaggle yourself with the GPU on and any
datasets attached, make it public, and put its link in the lab's `kaggleUrl` field in `assets/labs.js`.
The button becomes **Copy & Edit on Kaggle**, and every copy keeps your settings and data.

## Add a lab

1. Drop `NN_name.ipynb` into `notebooks/` (copy the Setup and Loader cells from an existing lab).
2. Add an entry to `assets/labs.js`. That's it; the card is generated automatically.

Student prerequisite: a Kaggle account with a **verified phone number** (needed for GPU and Internet), or any Google account for Colab.
