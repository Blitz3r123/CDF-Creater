data <- read.csv("/Users/kaleem/Documents/Tests/Set 8 [Instances]/10 Instances Keyed/100 Bytes/1 Pub 5 Sub/1.8 Reliability Unicast/Run 1/pub.csv")
png(file="pub.png")
plot.ecdf(data$OneWayLatencyus, xlab="OneWayLatencyus Latency")
dev.off()