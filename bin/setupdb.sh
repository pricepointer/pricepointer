#!/bin/bash
#
#

set -e

createuser dropshop --createdb --login --superuser
createdb dropshop --owner=dropshop
