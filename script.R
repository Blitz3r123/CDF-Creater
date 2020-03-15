data <- read.csv("/Users/kaleem/Documents/Tests/Set 10 [Incomplete]/1 Pub 1 Sub/1.1 Best Effort Multicast/Run 3/pub.csv")
png(file="cdf.png")
plot.ecdf(data$One-Way Latency (us):, xlab="One-Way Latency (us):")
dev.off()