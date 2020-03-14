data <- read.csv("/Users/kaleem/Documents/performance-testing/Tests copy/Set 15 [Multipub Tests]/Best Effort Multicast/5 Publishers/5 Subscribers/Run 1/pub.csv")
png(file="cdf.png")
plot.ecdf(data$OneWayLatencyus, xlab="OneWayLatencyus")
dev.off()