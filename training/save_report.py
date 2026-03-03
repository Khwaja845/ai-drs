import os

# Your verified results from the TUF A15 run
cv_data = {
    "folds": [0.8104, 0.8084, 0.8107, 0.8118, 0.8109],
    "mean": 0.8104,
    "std": 0.0011
}

output_path = os.path.join("evaluation", "cross_validation_report.txt")
os.makedirs("evaluation", exist_ok=True)

with open(output_path, "w") as f:
    f.write("==========================================\n")
    f.write("STRATIFIED 5-FOLD CROSS-VALIDATION REPORT\n")
    f.write("==========================================\n")
    f.write(f"Model: LightGBM (Final)\n")
    f.write(f"Individual Fold Accuracies: {cv_data['folds']}\n")
    f.write(f"Mean Accuracy: {cv_data['mean'] * 100:.2f}%\n")
    f.write(f"Standard Deviation: {cv_data['std'] * 100:.4f}\n")
    f.write(f"Final Metric: {cv_data['mean'] * 100:.2f}% (+/- {cv_data['std'] * 200:.2f}%)\n")
    f.write("==========================================\n")

print(f"✅ Report saved to {output_path}")
