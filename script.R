data <- read.csv("/Users/kaleem/Documents/Tests/Set 9 [Keyed Instances]/100 Byte/1 Pub 5 Sub/1.8 Reliability Unicast/Run 3/pub.csv")
png(file="pub.png")
plot.ecdf(data$OneWayLatencyus, xlab="OneWayLatencyus Latency")
dev.off()