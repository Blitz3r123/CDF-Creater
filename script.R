data <- read.csv("/Users/kaleem/Documents/Tests/Set 15 [5 Pub Tests]/Reliable Unicast/5 Publishers/5 Subscribers/Run 3/pub.csv")
png(file="pub.png")
plot.ecdf(data$OneWayLatencyus, xlab="OneWayLatencyus Latency")
dev.off()