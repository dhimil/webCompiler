#!/bin/bash
set -e

mkdir -p ./out/

file=$1
out=./out/`echo $file | awk -F '/' '{print $NF}'`.out

g++ $file -o $out
./$out

rm $out
