# AI Lab: Kaggle-powered deep learning labs

Interactive AI labs for the College of Computer Studies, University of Technology Bahrain.
The website is hosted on **GitHub Pages** and each notebook opens in one click on **Kaggle**,
where every student gets free NVIDIA GPU time (about 30 h/week, T4 x2 or P100).

| # | Lab | Data | Accelerator |
|---|-----|------|-------------|
| 00 | Kaggle setup check | sklearn digits | CPU |
| 01 | MNIST with classical ML | MNIST | CPU |
| 02 | MNIST MLP (Keras) | MNIST | GPU |
| 03 | MNIST CNN (Keras) | MNIST | GPU |
| 04 | Fashion-MNIST + augmentation | Fashion-MNIST | GPU |
| 05 | CIFAR-10 transfer learning | CIFAR-10 | GPU |
| 06 | Autoencoder (unsupervised) | MNIST | GPU |
| 07 | MNIST CNN in PyTorch | MNIST | GPU |

## Deploy (once)

1. Create the GitHub repo `SaeedSerwan/ailab` (public) and push this folder to `main`.
2. Repo **Settings → Pages → Deploy from a branch → `main` / root**.
3. The site is live at `https://saeedserwan.github.io/ailab/`.
4. If you use a different user, repo or branch, change it in `assets/labs.js`.

## How the 1-click button works

```
https://www.kaggle.com/kernels/welcome?src=https://github.com/<user>/<repo>/blob/<branch>/notebooks/<file>.ipynb
```

Kaggle imports the notebook from GitHub into the student's own account. Each notebook then:

* checks for a GPU and tells the student how to turn it on if it's missing;
* downloads its dataset through `keras.datasets` / `torchvision` (needs *Settings → Internet → On*),
  falling back to a copy attached with **+ Add Input**;
* writes models and files to `/kaggle/working`.

**Even more reliable (optional):** publish each notebook on Kaggle yourself with the GPU on and any
datasets attached, make it public, and put its link in the lab's `kaggleUrl` field in `assets/labs.js`.
The button becomes **Copy & Edit on Kaggle**, and every copy keeps your settings and data.

## Add a lab

1. Drop `NN_name.ipynb` into `notebooks/` (copy the Setup and Loader cells from an existing lab).
2. Add an entry to `assets/labs.js`. That's it; the card is generated automatically.

Student prerequisite: a Kaggle account with a **verified phone number** (required for GPU and Internet).
