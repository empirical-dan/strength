
x=c(1:20, 1:20, 1:11)
y=c(100,95.5,92.2,89.2,86.3,83.7,81.1,78.6,76.2,73.9,72.4,70.7,69.1,67.6,66.3,65,63.8,62.7,61.7,60.8, 100,95,90,87.5,85,83.3,81.6,80,77.5,75,72.5,70,68.3,66.67,65,63.4,61.8,60.2,58.6,57, 100,95,91,87,85,83,81,79,76,73,70)



plot(x,y)

model <- lm(y ~ (log(x+4.5)))
summary(model)

x2=seq(from=1,to=20,length.out=1000)
y2=predict(model,newdata=list(x=seq(from=1,to=20,length.out=1000)), interval="confidence")
matlines(x2,y2, lwd=2, col="green")



x=seq(1:20, 1:20, 1:11)

y2 = 146.73 - 27.25 * log(x + 4.5)



points(x, y2, col="red")
y2



#percentage_max = 146.73 - 27.25 * log(reps + 4.5)






