cmake_minimum_required(VERSION 3.10)
project(QuantStrategy)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(quant_strategy
    main.cpp
    QuantStrategy.cpp
) 