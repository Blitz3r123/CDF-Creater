data <- read.csv("/Users/kaleem/Documents/performance-testing/Tests/Set 1/1 to 10/pub.csv")
png(file="cdf.png")
plot.ecdf(data$Latency, xlab="Latency")
dev.off()